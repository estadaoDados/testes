var margin = {top: 40, right: 20, bottom: 20, left: 45},
    //width = 960 - margin.right - margin.left,
    //height = 500 - margin.top - margin.bottom;
    width = 980 - margin.right - margin.left,
    height = 400 - margin.top - margin.bottom;

var y = d3.scale.linear()
    .range([0,height]);

var x = 27; // bar width
//var y = 12; // bar height

var z = d3.scale.ordinal()
    .range(["steelblue", "#ccc"]); // bar color

var duration = 750,
    delay = 25;

var hierarchy = d3.layout.partition()
    .value(function(d) { return d.size; });

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var svg = d3.select("#estadaoDados").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + ",7)");// + margin.top + ")");

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", up);

svg.append("g")
    .attr("class", "y axis");

svg.append("g")
    .attr("class", "x axis")
  .append("line")
    .attr("y1", height)
    .attr("y2", height)
    .attr("x1", width)

d3.json("estadaodados.json", function(root) {
  hierarchy.nodes(root);
  y.domain([0, root.value]).nice();
  down(root, 0);
});

function down(d, i) {
  if (!d.children || this.__transition__) return;
  var end = duration + d.children.length * delay;

  // Mark any currently-displayed bars as exiting.
  var exit = svg.selectAll(".enter").attr("class", "exit");

  // Entering nodes immediately obscure the clicked-on bar, so hide it.
  exit.selectAll("rect").filter(function(p) { return p === d; })
      .style("fill-opacity", 1e-6);

  // Enter the new bars for the clicked-on data.
  // Per above, entering bars are immediately visible.
  var enter = bar(d)
      .attr("transform", stack(i))
      .style("opacity", 1);

  // Have the text fade-in, even though the bars are visible.
  // Color the bars as parents; they will fade to children if appropriate.
  enter.select("text").style("fill-opacity", 1e-6);
  enter.select("rect").style("fill", z(true));

  // Update the y-scale domain.
  y.domain([0,d3.max(d.children, function(d) { return d.value; })]).nice();

  // Update the y-axis.
  svg.selectAll(".y.axis").transition().duration(duration).call(yAxis);

  // Transition entering bars to their new position.
  var enterTransition = enter.transition()
      .duration(duration)
      .delay(function(d, i) { return i * delay; })
      .attr("transform", function(d, i) { return "translate(" + x * i * 1.2 + ",0)"; });

  // Transition entering text.
  enterTransition.select("text").style("fill-opacity", 1);

  // Transition entering rects to the new x-scale.
  enterTransition.select("rect")
      .attr("height", function(d) { return y(d.value); })
      .style("fill", function(d) { return z(!!d.children); });

  // Transition exiting bars to fade out.
  var exitTransition = exit.transition()
      .duration(duration)
      .style("opacity", 1e-6)
      .remove();

  // Transition exiting bars to the new x-scale.
  exitTransition.selectAll("rect").attr("width", function(d) { return y(d.value); });

  // Rebind the current node to the background.
  svg.select(".background").data([d]).transition().duration(end); d.index = i;
}

function up(d) {
  if (!d.parent || this.__transition__) return;
  var end = duration + d.children.length * delay;

  // Mark any currently-displayed bars as exiting.
  var exit = svg.selectAll(".enter").attr("class", "exit");

  // Enter the new bars for the clicked-on data's parent.
  var enter = bar(d.parent)
      .attr("transform", function(d, i) { return "translate(" + x * i * 1.2 + ",0)"; })
      .style("opacity", 1e-6);

  // Color the bars as appropriate.
  // Exiting nodes will obscure the parent bar, so hide it.
  enter.select("rect")
      .style("fill", function(d) { return z(!!d.children); })
    .filter(function(p) { return p === d; })
      .style("fill-opacity", 1e-6);

  // Update the x-scale domain.
  y.domain([0,d3.max(d.parent.children, function(d) { return d.value; })]).nice();

  // Update the x-axis.
  svg.selectAll(".y.axis").transition().duration(duration).call(yAxis);

  // Transition entering bars to fade in over the full duration.
  var enterTransition = enter.transition()
      .duration(end)
      .style("opacity", 1);

  // Transition entering rects to the new x-scale.
  // When the entering parent rect is done, make it visible!
  enterTransition.select("rect")
      .attr("height", function(d) { return y(d.value); })
      .each("end", function(p) { if (p === d) d3.select(this).style("fill-opacity", null); });

  // Transition exiting bars to the parent's position.
  var exitTransition = exit.selectAll("g").transition()
      .duration(duration)
      .delay(function(d, i) { return i * delay; })
      .attr("transform", stack(d.index));

  // Transition exiting text to fade out.
  exitTransition.select("text")
      .style("fill-opacity", 1e-6);

  // Transition exiting rects to the new scale and fade to parent color.
  exitTransition.select("rect")
      .attr("height", function(d) { return y(d.value); })
      .style("fill", z(true));

  // Remove exiting nodes when the last child has finished transitioning.
  exit.transition().duration(end).remove();

  // Rebind the current parent to the background.
  svg.select(".background").data([d.parent]).transition().duration(end);;
}

// Creates a set of bars for the given data node, at the specified index.
function bar(d) {
  var bar = svg.insert("g", ".y.axis")
      .attr("class", "enter")
      .attr("transform", "translate(5,0)")
    .selectAll("g")
      .data(d.children)
    .enter().append("g")
      .style("cursor", function(d) { return !d.children ? null : "pointer"; })
      .on("click", down);

  bar.append("text")
      .attr("x", x / 2)
      .attr("y", height)
      .attr("dx", ".35em")
      .attr("transform","rotate(-45 " + x/2 + " " + height + "), translate(-20, " + margin.bottom + ")")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; });

  bar.append("rect")
      .attr("y", 0)
      .attr("height", function(d) { return y(d.value); })
      .attr("width", x)
     // .attr("transform", "rotate(180), translate(-" + 1.4*margin.right + ", -" + height + ")")
/*
    bar.append("svg:line")
        .attr("class", "marker")
        .attr("y1", function(d) { return y(d.value);})
        .attr("y2", function(d) { return y(d.value);})
        .attr("x1", x/6)
        .attr("x2", x*5/6);
  */  
    return bar;
}

// A stateful closure for stacking bars vertically.
function stack(i) {
  var y0 = 0;
  return function(d) {
    var ty = "translate(" + x * i * 1.2 + ",-" + y0 + ")";
    y0 += y(d.value);
    return ty;
  };
}
