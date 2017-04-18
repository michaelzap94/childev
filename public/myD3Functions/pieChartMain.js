    //tooltip
    var tooltipMainPie = d3.select("body").append("div")   
            .attr("class", "tooltip")
            .style("opacity", 0);
    
        
    function chooseColorMainPieChart(label){ 
        return {Intellectual:"#296CAB", Social:"#F63341",Physical:"#F5CE29"}[label]; 
        
    };

        function getLegend(d,aD){ // Utility function to compute percentage.
            return d3.format("%")(d.value/d3.sum(aD.map(function(v){ return v.value; })));
        }

       
        // function to handle pieChart.
        var width = 200;
        var height = 200;
        var radius = (Math.min(width, height) / 2)-5;
        var innerRadius = (radius * 0.4);
        var fontSize = Math.min(width,height)/4;

   // create svg for pie chart.
        var svgPie = d3.select('#pieChartMain')
           .append("div")
           .style({'padding':"2px" })
           .classed("svg-container", true) //container class to make it responsive
           .append("svg")
           .style({'padding':"2px" })
           .attr({"id":"svg-pieChartMain"})//responsive SVG needs these 2 attributes and no width and height attr
           .attr("preserveAspectRatio", "xMinYMin meet")
           .attr("viewBox", "0 0 "+Math.min(width,height) +' '+Math.min(width,height))
           .append('g').attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")")
            .classed("svg-content-responsive", true);//class to make it responsive

          
           
    //creates the arc and sets its size.
    var arc = d3.svg.arc().outerRadius(radius).innerRadius(innerRadius);
    
  // Computes the angles of pie slices.
    var pie = d3.layout.pie().sort(null).value(function(d) { return d.value; });
    
    var myStartData = [{ label: "Intellectual", value: 1 },
                      { label: "Social", value: 1 },
                      { label: "Physical", value: 1 }];
              
             // Draw the pie slices.
        svgPie.selectAll("path").data(pie(myStartData)).enter().append("path")
            .attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return chooseColorMainPieChart(d.data.label); }).on("mouseover",myMouseOverMainPie)
           .on("mouseout",myMouseOutMainPie);
           
    function myMouseOverMainPie(d){
        tooltipMainPie.transition()
            .duration(250)      
            .style("opacity", 0.9);
            
        tooltipMainPie.html("<strong>Avg. Mark (priorities applied): " + Math.round(d.value / 10) + "</strong>")  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY) + "px");   
    } 

    function myMouseOutMainPie(d){   
    tooltipMainPie.transition()        
            .duration(250)      
            .style("opacity", 0);   

    }    

  /** create table for legend.**********/
        var myLegend = d3.select('#legendPieChartMain').append("table").classed('myLegend',true);
        
        var tr = myLegend.append("tbody").selectAll("tr").data(myStartData).enter().append("tr");
            
       var colorValueContainer =  tr.append("td").append('div').classed('myLegendColorLabel',true);
        
                colorValueContainer.append('svg').classed('myLegendColor',true)
                .attr({
                "width":'15',
                "height":'15'})
                .append("rect")
                .attr({
                "width":'15',
                "height":'15'})
    			.attr("fill",function(d){ return chooseColorMainPieChart(d.label);});
    			
    			colorValueContainer.append("span").classed('myLegendLabel',true).text(function(d){ return d.label;});
        
       // var valueContainer = tr.append("td").append('div').classed('myLegendValuePercentage',true);
        

       /* tr.append("td").classed('myLegendValue',true)
            .text(function(d){ return d.value;});
*/
        tr.append("td").classed('myLegendPercentage',true)
            .text(function(d){ return getLegend(d,myStartData);});


/**
 * This function receives data object from the main graph when a bar is clicked.
 *
 */
function pieChartMain(myDataSet){
    var pieFunctions={};
        
/*
          // Draw the pie slices.
        svgPie.selectAll("path").data(pie(myDataSet)).enter().append("path")
            .attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return chooseColorMainPieChart(d.data.label); });

*/


  // Update pie-chart. This will be used by histogram.
        pieFunctions.updateChart = function(){
   

            svgPie.selectAll("#pieChartMain path").data(pie(myDataSet)).transition().duration(500)
                .attrTween("d", arcTween);
        } 

        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }    

     
        // Utility function to be used to update the legend.
        pieFunctions.updateLegend = function(){
            // update the data attached to the row elements.
            var myLeg = myLegend.select("tbody").selectAll("tr").data(myDataSet);

            // update the value column.
            myLeg.select("#legendPieChartMain .myLegendValue").text(function(d){ return d.value;});

            // update the percentage column.
            myLeg.select("#legendPieChartMain .myLegendPercentage").text(function(d){ return getLegend(d,myDataSet);});        
        }
        

       return pieFunctions;
        

    
    }