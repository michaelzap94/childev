
function main(myDataArray){
    
    myDataArray.forEach(function(e,i){
        e.week = 'Report ' + (i+1);
    })

/****DIMENSIONS AND PADDING****************************************************************************/
    //dimensions of the SVG
    var dim = {};
    dim.width = 800; 
    dim.height = 350;
    var colorBars = '#00B3FE';
    var paddingLeftSide = 60;
    var paddingBottom = 10;
 
/*****SVG*******************************************************************************/        

    var svg = d3.select("#mainGraph")
           .append("div")
           .classed("svg-container", true) //container class to make it responsive
           .append("svg")
           .attr({"id":"svg-mainGraph"})//responsive SVG needs these 2 attributes and no width and height attr
           .attr("preserveAspectRatio", "xMinYMin meet")
           .attr("viewBox", "0 0 800 430")
           .classed("svg-content-responsive", true);//class to make it responsive
           
           
/****SCALES****************************************************************************/   

   // create function for x-axis mapping.
    var xScale = d3.scale.ordinal()
        .domain(myDataArray.map(function(d) { return d.week; }))
        .rangeRoundBands([paddingLeftSide, dim.width-paddingLeftSide], 0.12)
        ;
        
   // Create function for y-axis map.
    var yScale = d3.scale.linear()
        .domain([0, 1000])
        .range([dim.height, 0])
        .nice();


/*****AXIS********************************************************************************/
    // X axis of graph
    var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom");
    svg.append("g").attr({
        "class": "x axis",
        "transform": "translate(0," + (dim.height+paddingBottom) + ")"
        })
        .call(xAxisGen);
        
    // Y axis of graph 
    var yAxisGen = d3.svg.axis().scale(yScale).orient("left").ticks(10);
    svg.append("g").attr({
        "class": "y axis",
       "transform": "translate("+paddingLeftSide+","+paddingBottom+")"
        })
        .call(yAxisGen);

/******BARS*******************************************************************************/
 
    // Bars of the main graph
    var myBars = svg.selectAll(".oneBar").data(myDataArray).enter()
            .append("g").attr("class", "oneBar");
    
    
       //Rectangles.
        myBars.append("rect")
            .attr({
                x: function(d) { return xScale(d.week);},
                y: function(d) { return yScale(d.avgValue);},
                "width": xScale.rangeBand(),
                "height": function(d) { return dim.height - yScale(d.avgValue)+9;},//the +9 is because the stroke-width is 2px and the padding in axis is 10
                "fill":colorBars
            })
            .on("click", myClickEvent);// myClickEvent is defined below.AND D3 PASSES DATA AS ARGUMENT AUTOMATICALLY.
         /*  .on("mouseover",myMouseOverEvent)
           .on("mouseout",myMouseOutEvent);// mouseout is defined below.
           */
           
 /****FUNCTIONS USED BY BARS*******************************************************/          
    function generateDataMainPieChart(myDataObject){
      return [{ label: "Intellectual", value: parseInt(myDataObject.intellectual[0].realValue) },
              { label: "Social", value: parseInt(myDataObject.social[0].realValue) },
              { label: "Physical", value: parseInt(myDataObject.physical[0].realValue) }];
    } 
    
    function generateDataIntellectualPieChart(myDataObject){
      return [{ label: "Mathematical", value: parseInt(myDataObject.intellectual[0].skills.mathematical) },
              { label: "Language", value: parseInt(myDataObject.intellectual[0].skills.language)},
              { label: "Attention", value: parseInt(myDataObject.intellectual[0].skills.attention)},
              { label: "Recognition", value: parseInt(myDataObject.intellectual[0].skills.recognition)}];
    } 
    
    function generateDataSocialPieChart(myDataObject){
      return [{ label: "Respect", value: parseInt(myDataObject.social[0].skills.respect) },
              { label: "Team-working", value: parseInt(myDataObject.social[0].skills.teamworking) },
              { label: "Independence", value: parseInt(myDataObject.social[0].skills.independence)},
              { label: "Emotional-expression", value: parseInt(myDataObject.social[0].skills.feelingsexpression)}];
    } 
    
    function generateDataPhysicalPieChart(myDataObject){
      return [{ label: "Motor", value: parseInt(myDataObject.physical[0].skills.motor) },
              { label: "Manipulative", value: parseInt(myDataObject.physical[0].skills.manipulative) },
              { label: "Hygiene", value: parseInt(myDataObject.physical[0].skills.hygiene)},
              { label: "Diet", value: parseInt(myDataObject.physical[0].skills.diet)}];
    } 
     
    function myMouseOverEvent(d){
        var dataSet = generateDataMainPieChart(d);
       var _pieChartMain= pieChartMain(dataSet);
        _pieChartMain.updateChart(); //update main pie chart
        
        _pieChartMain.updateLegend();//update legend of main pie chart
    } 

        function myMouseOutEvent(d){    // utility function to be called on mouseout.
      /*   var myStartData = [{ label: "Intellectual", value: 1 },
                      { label: "Social", value: 1 },
                      { label: "Physical", value: 1 }];
              
  
        
         var _pieChartMain= pieChartMain(myStartData);
            _pieChartMain.updateChart(); //update main pie chart
            _pieChartMain.updateLegend();//update legend of main pie chart
            */
        }
     
    function myClickEvent(d){
        
        //Bars
        d3.selectAll('.oneBar rect').attr({"fill":colorBars});   
        d3.select(this).attr({"fill":"darkblue"});        
        
        /**pie chart MAIN**********************************/
           var dataSet = generateDataMainPieChart(d);
           var _pieChartMain= pieChartMain(dataSet);
            _pieChartMain.updateChart(); //update main pie chart
            _pieChartMain.updateLegend();//update legend of main pie chart
        /************************************************/
       
        /**pie chart OTHERS**********************************/
          var dataSetIntellectual = generateDataIntellectualPieChart(d);
           var dataSetSocial = generateDataSocialPieChart(d);
           var dataSetPhysical = generateDataPhysicalPieChart(d);
           
           var _pieChartOthers= pieChartOthers(dataSetIntellectual,dataSetSocial,dataSetPhysical);
            _pieChartOthers.updateChart(); //update main pie chart
            _pieChartOthers.updateLegend();//update legend of main pie chart
        /************************************************/


    }
    
     
    
    
    
}//main function