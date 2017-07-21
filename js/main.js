import 'babel-polyfill';
import * as d3 from 'd3';


//http://vallandingham.me/scroller.html <<--integrate scroller with visualization



// 1. load data in with d3
// 2. create circles from data
// 3. add force fields and color according to data
// 4. switch sections using scroller

// const vis = {};



const app = {};

app.init = ()=>{

  var width = window.innerWidth-100; 
  var height = window.innerHeight-100;

  //padding = 1.5, // separation between same-color nodes
  //clusterPadding = 6, // separation between different-color nodes

 var svg = d3.select('#vis').append('svg')
    .attr("width",width)
    .attr("height",height)
    .append("g")
    .attr("class", "nodes");


  const data = d3.csv('./dummy.csv', (error,d) => {
    if (error) throw error;

    var nodes = d;

    console.log(nodes);


   var simulation = d3.forceSimulation()
      .nodes(nodes)
      .force("y", d3.forceY(height/2))
      .force("charge_force", d3.forceManyBody())
      // .force("center_force", d3.forceCenter(width / 2,height / 2));
      .force("originEndemic", isolate(d3.forceX(0), function(d) { return d.originEndemic === "TRUE"; }))
      .force("originEndemic", isolate(d3.forceX(0), function(d) { return d.originEndemic === "FALSE "; }))
      // .force("charge", d3.forceManyBody().strength(-10))
      // .on("tick", ticked)




   var node =svg.selectAll("circle")
      .data(d)
      .enter()
      .append("circle")
      // .attr("id", (d)=>{return d.cntry})
      .attr("r", (d)=>{return d.numTravelersOutbound/10000})
      .attr("fill", (d)=>{
          if (d.vaccFrmEndemic === "Yes"){return "blue"}
          else { return "red"}
        })
      .style("opacity",0.5);

    node.on("mouseenter", (d)=>{
      console.log(d.cntry);
      console.log(d.numTravelersOutbound);
      console.log("Is proof of vaccination required from endemic countries? " +d.numTravelersOutbound);
    })


    function tickActions() {

       node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
    }



    // function drawNode(nodes) {
    //   context.beginPath();
    //   context.moveTo(d.x + 3, d.y);
    //   context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    //   context.fillStyle = d.color;
    //   context.fill();
    // }

    // function ticked() {
    //   context.clearRect(0, 0,width,height);
    //   context.save();
    //   context.translate(width / 2,height / 2);
    //   nodes.forEach(drawNode);
    //   context.restore();
    // }

      simulation.on("tick", tickActions);

      function isolate(force, filter) {
        var initialize = force.initialize;
        force.initialize = function() { initialize.call(force, nodes.filter(filter)); };
        return force;
      }
  });
}


$(function(){
  app.init();
});





