function filterData(myDataArray,monthSelected,yearSelected){
    var monthSelected = parseInt(monthSelected);  
    var yearSelected = parseInt(yearSelected);
    //filter data passed to only display data created on a specific month
    var updatedData = myDataArray.filter(function(reportObject){
        var dateCreated = new Date(reportObject.dateCreated);
        var monthCreated = dateCreated.getMonth();
        var yearCreated = dateCreated.getFullYear();
        if(monthCreated===monthSelected&&yearCreated===yearSelected){
            return reportObject;
        }
    });
    
    return updatedData;
}

function main(myDataArray,monthSelected,yearSelected){
    var mainFunctions = {};
    //filter data passed to only display data created on a specific month
    var filteredDataByDate = filterData(myDataArray,monthSelected,yearSelected);
    
    //add a reportNumber attribute to object
    filteredDataByDate.forEach(function(e,i){
        e.reportNumber = 'Rep ' + (i+1);
    });
    
//tooltip
var tooltip = d3.select("body").append("div")   
            .attr("class", "tooltip")
            .style("opacity", 0);

/****DIMENSIONS AND PADDING****************************************************************************/
    //dimensions of the SVG
   
    var widthMain = 800; 
    var heightMain = 350;
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
        .domain(filteredDataByDate.map(function(d) { return d.reportNumber; }))
        .rangeRoundBands([paddingLeftSide, widthMain-paddingLeftSide], 0.12);
        
   // Create function for y-axis map.
    var yScale = d3.scale.linear()
        .domain([0, 100])
        .range([heightMain, 0])
        .nice();


/*****AXIS********************************************************************************/
    // X axis of graph
    var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom");
    svg.append("g").attr({
        "class": "x axis",
        "transform": "translate(0," + (heightMain+paddingBottom) + ")"
        }).call(xAxisGen);

      
    // Y axis of graph 
    var yAxisGen = d3.svg.axis().scale(yScale).orient("left").ticks(10).innerTickSize(-widthMain+paddingLeftSide+paddingLeftSide).outerTickSize(0).tickPadding(10);
    svg.append("g").attr({
        "class": "y axis",
       "transform": "translate("+paddingLeftSide+","+paddingBottom+")"
        }).call(yAxisGen);
        
   /*
d3.selectAll('.tick')
  .on('click', function (d, i) {
     // d3.select('#reportNumber').html(d);
    console.log(filteredDataByDate[i])
  });

*/
/******BARS*******************************************************************************/
    // Bars of the main graph
    var myBars = svg.selectAll(".oneBar").data(filteredDataByDate).enter()
            .append("g").attr("class", "oneBar");
    
      
       //Rectangles.
        myBars.append("rect")
            .attr({
                x: function(d) { return xScale(d.reportNumber);},
                y: function(d) { return yScale(Math.round(d.avgValue / 10))+paddingBottom;},
                "width": xScale.rangeBand(),
                "height": function(d) { return heightMain - yScale(Math.round(d.avgValue / 10))-1;},//the - is because the stroke-width is 2px and the padding in axis is 10
                "fill":colorBars
            }).style("cursor", "pointer")
            .on("click", myClickEvent)// myClickEvent is defined below.AND D3 PASSES DATA AS ARGUMENT AUTOMATICALLY.
            .on("mouseover",myMouseOverEvent)
           .on("mouseout",myMouseOutEvent);// 
           
           
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

        tooltip.transition()
            .duration(250)      
            .style("opacity", 0.9);
            
        tooltip.html("<strong>Average mark: " + Math.round(d.avgValue / 10) + "%</strong>")  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY) + "px");   
    } 

        function myMouseOutEvent(d){   
        tooltip.transition()        
                .duration(250)      
                .style("opacity", 0);   

        }
     
    function myClickEvent(d){
        if(userLabelFromEjs==='parent'){
            var replyLink = '/dashboard/'+userLabelFromEjs+'/'+userIdFromEjs+'/messages/new?userIdTo='+d.teacher.id+'&labelTo=teacher';
            d3.selectAll('.reportNumber').html(d.reportNumber);
            document.getElementById("teacherInfo").disabled = false;
            
            d3.select('#teacherName .info').html(d.teacher.name);
            d3.select('#teacherEmail .info').html(d.teacher.username);
            d3.select('#dateCreated .info').html(d.dateCreated);
            d3.select('#comments').html(d.comments);
            d3.select('#sendMessageTeacher').attr('href', replyLink);
        }            
        
        
        /*********************************************/
        svg.selectAll('.myTextMark').text('');   
        
        svg.append("text").text(Math.round(d.avgValue / 10))
         .attr({
            "text-anchor": "middle",
            x: parseFloat(d3.select(this).attr("x"))+parseFloat(d3.select(this).attr("width")/2), //complicated but works
            y: parseFloat(d3.select(this).attr("y"))+22, //show inside the bars
            "font-family": "sans-serif",
            "font-weight":'bold',
            "word-wrap": "break-word",
            "font-size": 18,
            "class": "myTextMark",
            "id":"myTextMark",
            "fill":'white'
          });

       /*******************************************************/ 
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
    
    mainFunctions.updateMain = function(myDataArray,monthSelected,yearSelected){

                
        svg.selectAll('.myTextMark').text('');   
        
        var filteredDataUpdate = filterData(myDataArray,monthSelected,yearSelected);
        
            //add a reportNumber attribute to object
            filteredDataUpdate.forEach(function(e,i){
                e.reportNumber = 'Report ' + (i+1);
            });
    

    
        // Update function for y-axis map.ss
        yScale.domain([0, 100]).range([heightMain, 0]).nice();
        
        
        //  Update function for x-axis map.
        xScale.domain(filteredDataUpdate.map(function(d) { return d.reportNumber; }))
        .rangeRoundBands([paddingLeftSide, widthMain-paddingLeftSide], 0.12);
        
        
        //  Update x-Axis.
        var xAxisUpdate = d3.svg.axis().scale(xScale).orient("bottom");
         svg.selectAll(".x").transition().duration(500)
         .attr({
        "transform": "translate(0," + (heightMain+paddingBottom) + ")"
        }).call(xAxisUpdate);
        
        
            // Y axis of graph 
        var yAxisUpdate = d3.svg.axis().scale(yScale).orient("left").ticks(10);
        svg.selectAll("y").attr({
       "transform": "translate("+paddingLeftSide+","+paddingBottom+")"
        }).call(yAxisUpdate);
        
        // Update bars Data of the main graph with the new data
         var myBarsUpdate = svg.selectAll(".oneBar").data(filteredDataUpdate);
         
         /***************************************************/
         //if one bar was previusly deleted, create it again.
         myBarsUpdate.enter().append("g").attr("class", "oneBar").append("rect")
            .attr({
                x: function(d) { return xScale(d.reportNumber);},
                y: function(d) { return yScale(Math.round(d.avgValue / 10));},
                "width": xScale.rangeBand(),
                "height": function(d) { return heightMain - yScale(Math.round(d.avgValue / 10))+9;},//the +9 is because the stroke-width is 2px and the padding in axis is 10
                "fill":colorBars
            }).on("click", myClickEvent).on("mouseover",myMouseOverEvent)
           .on("mouseout",myMouseOutEvent);
        /*************************************************************/
        
       //Rectangles update
        myBarsUpdate.select("rect").transition().duration(500).ease("linear")
            .attr({
                x: function(d) { return xScale(d.reportNumber);},
                y: function(d) { return yScale(Math.round(d.avgValue / 10))+paddingBottom;},
                "width": xScale.rangeBand(),
                "height": function(d) { return heightMain - yScale(Math.round(d.avgValue / 10))-1;},//the -1 is because the stroke-width is 2px and the padding in axis is 10
                "fill":colorBars
            });
            
        //Delete bars that don't exist in the new data    
        myBarsUpdate.exit().remove();
       

        }        

    return mainFunctions;
    
    
}//main function