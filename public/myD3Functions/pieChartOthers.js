    //tooltip
    var tooltipOthersPie = d3.select("body").append("div")   
            .attr("class", "tooltip")
            .style("opacity", 0);
    function myMouseOverOthersPie(d){
        tooltipOthersPie.transition()
            .duration(250)      
            .style("opacity", 0.9);
            
        tooltipOthersPie.html("<strong>Mark: " + Math.round(d.value) + "</strong>")  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY) + "px");   
    } 

    function myMouseOutOthersPie(d){   
    tooltipOthersPie.transition()        
            .duration(250)      
            .style("opacity", 0);   

    }    
/************COMMON TO 3 OTHERS PIE CHARTS **********************************/    
        
    function chooseColorOthersPieChart(label){ 
        return {"Mathematical":"#C63D0F", 
                "Language":"#41ab5d",
                "Attention":"#CBE32D",
                "Recognition":"#7E8F7C",
                "Respect":"#005A31",
                "Team-working":"#3B3738",
                "Independence":"#807dba", 
                "Emotional-expression":"#e08214",
                "Motor":"#558C89",
                "Manipulative":"#D9853B", 
                "Hygiene":"#7D1935",
                "Diet":"#E9E581"
                }[label]; 
        
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
        
        
/********START DATA****************************************************************************************************/
    
    var myStartDataIntellectual = [{ label: "Mathematical", value: 1 },
                                  { label: "Language", value: 1 },
                                  { label: "Attention", value: 1 },
                                  { label: "Recognition", value: 1 }];
                                  
    var myStartDataSocial = [{ label: "Respect", value: 1 },
                                  { label: "Team-working", value: 1 },
                                  { label: "Independence", value: 1 },
                                  { label: "Emotional-expression", value: 1 }];  
                                  
    var myStartDataPhysical = [{ label: "Motor", value: 1 },
                                  { label: "Manipulative", value: 1 },
                                  { label: "Hygiene", value: 1 },
                                  { label: "Diet", value: 1 }];              
/**************************************************************************************************************************/         
/*****INTELLECTUAL*********************************************************************************************************************/ 
    // create svg for pie chart.
        var svgPieInt = d3.selectAll('#intellectualNP')
           .append("div")
           .style({'padding':"15px" , 'padding-left' :'5px'})
           .classed("svg-container", true) //container class to make it responsive
           .append("svg")
           .style({'padding':"15px" , 'padding-left' :'5px'})
           .attr("preserveAspectRatio", "xMinYMin meet")
           .attr("viewBox", "0 0 "+Math.min(width,height) +' '+Math.min(width,height))
           .append('g').attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")")
            .classed("svg-content-responsive", true);//class to make it responsive

        //creates the arc and sets its size.
        var arcInt = d3.svg.arc().outerRadius(radius).innerRadius(innerRadius);
        // Computes the angles of pie slices.
        var pieInt = d3.layout.pie().sort(null).value(function(d) { return d.value; });
        // Draw the slices.
        svgPieInt.selectAll("path").data(pieInt(myStartDataIntellectual)).enter().append("path")
            .attr("d", arcInt)
            .each(function(d) { this._currentIntellectual = d; })
            .style("fill", function(d) { return chooseColorOthersPieChart(d.data.label); }).on("mouseover",myMouseOverOthersPie)
           .on("mouseout",myMouseOutOthersPie);//
            

        /** create table for legend.********************************************************************************/
        var myLegendIntellectual = d3.selectAll('#legendIntellectualNP').append("table").classed('myLegend',true);

        var trIntellectual = myLegendIntellectual.append("tbody").selectAll("tr").data(myStartDataIntellectual).enter().append("tr");
            
        var colorValueContainerIntellectual =  trIntellectual.append("td").append('div').classed('myLegendColorLabel',true).attr("id", function(d, i) { return d.label; });
               
                colorValueContainerIntellectual.append('span').classed('infoLabel',true);
                
                colorValueContainerIntellectual.append('svg').classed('myLegendColor',true)
                .attr({
                "width":'15',
                "height":'15'})
                .append("rect")
                .attr({
                "width":'15',
                "height":'15'})
    			.attr("fill",function(d){ return chooseColorOthersPieChart(d.label);});
    			
    			colorValueContainerIntellectual.append("span").classed('myLegendLabel',true).text(function(d){ return d.label;});
        
        // var valueContainer = tr.append("td").append('div').classed('myLegendValuePercentage',true);
        

        trIntellectual.append("td").classed('myLegendValue',true)
            .text(function(d){ return d.value;});

        trIntellectual.append("td").classed('myLegendPercentage',true)
            .text(function(d){ return getLegend(d,myStartDataIntellectual);});
/**************************************************************************************************************************/              
/*****SOCIAL*********************************************************************************************************************/ 
    // create svg for pie chart.
        var svgPieSoc = d3.selectAll('#socialNP')
           .append("div")
           .style({'padding':"15px" , 'padding-left' :'5px'})
           .classed("svg-container", true) //container class to make it responsive
           .append("svg")
           .style({'padding':"15px" , 'padding-left' :'5px'})
           .attr("preserveAspectRatio", "xMinYMin meet")
           .attr("viewBox", "0 0 "+Math.min(width,height) +' '+Math.min(width,height))
           .append('g').attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")")
            .classed("svg-content-responsive", true);//class to make it responsive
            
        var arcSoc = d3.svg.arc().outerRadius(radius).innerRadius(innerRadius);
        // Computes the angles of pie slices.
        var pieSoc = d3.layout.pie().sort(null).value(function(d) { return d.value; });
        // Draw the slices.
        svgPieSoc.selectAll("path").data(pieSoc(myStartDataSocial)).enter().append("path")
            .attr("d", arcSoc)
            .each(function(d) { this._currentSocial = d; })
            .style("fill", function(d) { return chooseColorOthersPieChart(d.data.label); }).on("mouseover",myMouseOverOthersPie)
           .on("mouseout",myMouseOutOthersPie);//
            

        /** create table for legend.********************************************************************************/
        var myLegendSocial = d3.selectAll('#legendSocialNP').append("table").classed('myLegend',true);

        var trSocial = myLegendSocial.append("tbody").selectAll("tr").data(myStartDataSocial).enter().append("tr");
            
        var colorValueContainerSocial =  trSocial.append("td").append('div').classed('myLegendColorLabel',true).attr("id", function(d, i) { return d.label; });
        
                colorValueContainerSocial.append('span').classed('infoLabel',true);
        
                colorValueContainerSocial.append('svg').classed('myLegendColor',true)
                .attr({
                "width":'15',
                "height":'15'})
                .append("rect")
                .attr({
                "width":'15',
                "height":'15'})
    			.attr("fill",function(d){ return chooseColorOthersPieChart(d.label);});
    			
    			colorValueContainerSocial.append("span").classed('myLegendLabel',true).text(function(d){ return d.label;});
        
        // var valueContainer = tr.append("td").append('div').classed('myLegendValuePercentage',true);
        

        trSocial.append("td").classed('myLegendValue',true)
            .text(function(d){ return d.value;});

        trSocial.append("td").classed('myLegendPercentage',true)
            .text(function(d){ return getLegend(d,myStartDataSocial);});
/**************************************************************************************************************************/              
/*****PHYSICAL*********************************************************************************************************************/
    // create svg for pie chart.
        var svgPiePhy = d3.selectAll('#physicalNP')
           .append("div")
           .style({'padding':"15px" , 'padding-left' :'5px'})
           .classed("svg-container", true) //container class to make it responsive
           .append("svg")
           .style({'padding':"15px" , 'padding-left' :'5px'})
           .attr("preserveAspectRatio", "xMinYMin meet")
           .attr("viewBox", "0 0 "+Math.min(width,height) +' '+Math.min(width,height))
           .append('g').attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")")
            .classed("svg-content-responsive", true);//class to make it responsive
            
        var arcPhy = d3.svg.arc().outerRadius(radius).innerRadius(innerRadius);
        // Computes the angles of pie slices.
        var piePhy = d3.layout.pie().sort(null).value(function(d) { return d.value; });
         // Draw the slices.
        svgPiePhy.selectAll("path").data(piePhy(myStartDataPhysical)).enter().append("path")
            .attr("d", arcPhy)
            .each(function(d) { this._currentPhysical = d; })
            .style("fill", function(d) { return chooseColorOthersPieChart(d.data.label); }).on("mouseover",myMouseOverOthersPie)
           .on("mouseout",myMouseOutOthersPie);//
        


        /** create table for legend.********************************************************************************/
        var myLegendPhysical = d3.selectAll('#legendPhysicalNP').append("table").classed('myLegend',true);

        var trPhysical = myLegendPhysical.append("tbody").selectAll("tr").data(myStartDataPhysical).enter().append("tr");
            
        var colorValueContainerPhysical =  trPhysical.append("td").append('div').classed('myLegendColorLabel',true).attr("id", function(d, i) { return d.label; });
                
                colorValueContainerPhysical.append('span').classed('infoLabel',true);
                
                colorValueContainerPhysical.append('svg').classed('myLegendColor',true)
                .attr({
                "width":'15',
                "height":'15'})
                .append("rect")
                .attr({
                "width":'15',
                "height":'15'})
    			.attr("fill",function(d){ return chooseColorOthersPieChart(d.label);});
    			
    			colorValueContainerPhysical.append("span").classed('myLegendLabel',true).text(function(d){ return d.label;});
        
        // var valueContainer = tr.append("td").append('div').classed('myLegendValuePercentage',true);
        

        trPhysical.append("td").classed('myLegendValue',true)
            .text(function(d){ return d.value;});

        trPhysical.append("td").classed('myLegendPercentage',true)
            .text(function(d){ return getLegend(d,myStartDataPhysical);});
/**************************************************************************************************************************/              



/**
 * This function receives data object from the main graph when a bar is clicked.
 *
 */
function pieChartOthers(dataSetIntellectual,dataSetSocial,dataSetPhysical){
    
    
    
    var pieFunctions={};
    
  // Update pie-chart. This will be used by histogram.
        pieFunctions.updateChart = function(){

            svgPieInt.selectAll("#intellectualNP path").data(pieInt(dataSetIntellectual)).transition().duration(500)
                    .attrTween("d", arcTweenInt);
            
    
            function arcTweenInt(a) {
                var i = d3.interpolate(this._currentIntellectual, a);
                this._currentIntellectual = i(0);
                return function(t) { return arcInt(i(t));    };
            }  
            
            svgPieSoc.selectAll("#socialNP path").data(pieSoc(dataSetSocial)).transition().duration(500)
                    .attrTween("d", arcTweenSoc);
            
    
            function arcTweenSoc(a) {
                var i = d3.interpolate(this._currentSocial, a);
                this._currentSocial = i(0);
                return function(t) { return arcSoc(i(t));};
            }                
        
            svgPiePhy.selectAll("#physicalNP path").data(piePhy(dataSetPhysical)).transition().duration(500)
                    .attrTween("d", arcTweenPhy);
             
    
            function arcTweenPhy(a) {
                var i = d3.interpolate(this._currentPhysical, a);
                this._currentPhysical = i(0);
                return function(t) { return arcPhy(i(t));    };
            }    
            
        }
      // Utility function to be used to update the legend.
        pieFunctions.updateLegend = function(){
            // update the data attached to the row elements.
            var myLegInt = myLegendIntellectual.select("tbody").selectAll("tr").data(dataSetIntellectual);
            // update the frequencies.
            myLegInt.select(".myLegendValue").text(function(d){ return d.value;});
            // update the percentage column.
            myLegInt.select(".myLegendPercentage").text(function(d){ return getLegend(d,dataSetIntellectual);});    
            
            
            // update the data attached to the row elements.
            var myLegSoc = myLegendSocial.select("tbody").selectAll("tr").data(dataSetSocial);
            // update the frequencies.
            myLegSoc.select(".myLegendValue").text(function(d){ return d.value;});
            // update the percentage column.
            myLegSoc.select(".myLegendPercentage").text(function(d){ return getLegend(d,dataSetSocial);});    
            
            
            // update the data attached to the row elements.
            var myLegPhy = myLegendPhysical.select("tbody").selectAll("tr").data(dataSetPhysical);
            // update the frequencies.
            myLegPhy.select(".myLegendValue").text(function(d){ return d.value;});
            // update the percentage column.
            myLegPhy.select(".myLegendPercentage").text(function(d){ return getLegend(d,dataSetPhysical);});    
        }
        

       return pieFunctions;
        

    
    }