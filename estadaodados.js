var width = 980,
    height = 400,
    margin = {top: 5, right: 30, bottom: 20, left: 1}

var barWidth = 980,
    barHeight = 50,
    barMargin = {top: 5, right: 5, bottom: 20, left: 4};

var duracao = 2000

var grafico = ''
var jsonAtual = ""
var pilhaJson = []

//Função que gera um gráfico
function geraGrafico(nomeJson) {
    
    jsonAtual = nomeJson

    d3.json(nomeJson+".json", function(data) {
    
    nv.addGraph(function() {
        var chart = nv.models.bulletChart()
        
        var base = d3.select('#svgEstadaoDados')
                  .attr("height", 0)
                  .attr("width", width)
        
        base.transition()
                .duration(duracao)
                .attr("height",height)
        
        base.append("g")
                .attr("height", height)
                .attr("width", width)
                .attr("id", nomeJson)
            .selectAll("svg")
                .data(data)
            .enter().append("g")
                .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")")
                .transition().duration(duracao)
                .call(chart);
        return chart;
    })});

}

//Função que faz transição entre dois gráficos
function mudaGrafico(novoJson){
    d3.selectAll(".nv-measure").transition().duration(duracao).attr("width",0)//.style("opacity",0).remove()
    d3.selectAll(".nv-range").transition().duration(duracao).attr("width",0)//.style("opacity",0)
    d3.selectAll(".nv-markerTriangle").transition().duration(duracao).style("opacity",0)
    //d3.selectAll(".nv-title").transition().duration(1000).style("opacity",0).remove()
    //d3.selectAll(".nv-tick").transition().duration(1000).style("opacity",0).remove()
    d3.select("#svgEstadaoDados").transition().duration(duracao).attr("height",0)
    d3.select("#"+jsonAtual).transition().duration(duracao).style("opacity",0).remove().each("end",function(){
        pilhaJson.push(novoJson)
        geraGrafico('pmdb')})
    
    }

function voltaGrafico(){
    if (pilhaJson.length>0) {
        var novoJson = pilhaJson.pop()
        geraGrafico(novoJson)
    }
}

geraGrafico("partidos")
