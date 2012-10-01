var width = 980,
    height = 400,
    margin = {top: 5, right: 30, bottom: 20, left: 1}

var barWidth = 980,
    barHeight = 46,
    barMargin = {top: 2, right: 5, bottom: 20, left: 23};

var duracao = 1250,
    grafico = '',
    jsonAtual = "",
    pilhaJson = [],
    erroEncontrado = false,
    mensagemErro = "",
    projecao = "prefeitos"


//Função que gera um gráfico
function geraGrafico(nomeJson) {
    
    jsonAtual = nomeJson
    var arquivo = "dados/"+nomeJson+".json"
    d3.json("dados/"+nomeJson+".json", function(data) {
        if (data) { 
            nv.addGraph(function() {
                var chart = nv.models.bulletChart()
                    chart.height(barHeight)
                    chart.width(barWidth)
                    chart.margin(barMargin)


                var svg = d3.select('#svgEstadaoDados')
                          .attr("height", 0)
                          .attr("width", width)
                
                svg.transition()
                        .duration(duracao)
                        .attr("height",height)
                //*
                if (!d3.select("#retornaBackground")[0][0]) {
                    svg.append("rect")
                        .attr("id", "retornaBackground")
                        .attr("class", "retornaBackground")
                        .attr("width", width)//width - margin.left - margin.right)
                        .attr("height", height)//height - margin.top - margin.bottom)
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                        .on("click",voltaGrafico)
                }
                //*/
                base = svg.append("g")
                        .attr("height", height)
                        .attr("width", width)
                        .attr("id", nomeJson)
                    
                base.selectAll("svg")
                        .data(data)
                    .enter()
                        .append("g")
                        .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")")
                        .on("click",avancaGrafico)
                        .transition().duration(duracao)
                        .call(chart);
                return chart;
            })
        } else {
            erroEncontrado = true
            voltaGrafico()
            mensagemErro = "Dados não disponíveis no momento"
            alertar()
        }
    })
}

//Função que faz transição entre dois gráficos
function novoGrafico(novoJson){
    nv.log("novoGrafico():")
    nv.log("    GraficoAtual: "+ jsonAtual)
    nv.log("    NovoGrafico: "+ novoJson)
    if (!erroEncontrado){
        //Efeito de redução do gráfico atual
        d3.selectAll(".nv-measure")
            .transition()
                .duration(duracao)
                .attr("width",0)
        d3.selectAll(".nv-range")
            .transition()
                .duration(duracao)
                .attr("width",0)
        d3.selectAll(".nv-markerTriangle")
            .transition()
                .duration(duracao)
                .style("opacity",0)
        d3.select("#svgEstadaoDados")
            .transition()
                .duration(duracao)
                .attr("height",0)
        
        //Reduzindo e removendo o gráfico atual e adicionando novo gráfico ao final da transição
        d3.select("#"+jsonAtual)
            .transition()
                .duration(duracao)
                .style("opacity",0)
                .remove()
                .each("end",function(){
                    geraGrafico(novoJson)
                })
    } else {
        erroEncontrado = false;
        geraGrafico(novoJson)
    }
}

function avancaGrafico(d){//(novoJson) {
    nv.log(d.title)
    pilhaJson.push(jsonAtual)
    nv.log(pilhaJson)
    nv.log("avancaGrafico(): Avançando gráfico para " + d.title + "_estados")
    novoGrafico(d.nextlevel)
}

function voltaGrafico(){
    if (pilhaJson.length) {
        var novoJson = pilhaJson.pop()
        nv.log("voltaGrafico(): Voltando gráfico de " + jsonAtual + " para " + novoJson)
        novoGrafico(novoJson)
    } else {
        nv.log("voltaGrafico(): Pilha vazia")
    }
}

function alertar() {
    var div = document.getElementById("alertar")
    div.style.display = 'block'
    div.style.top = height/2+'px'
    div.innerHTML = mensagemErro + "<br/><span id='fechar'>fechar</span>"
}

function esconderAlerta() {
    document.getElementById("alertar").style.display = 'none'
}

function estadaoDadosMuda(aba){
    console.log(aba)
}

$("#estadaoDadosAbas li").click( function() {
    projecao = this.firstChild.text.toLowerCase()    
    
    console.log(projecao);
})

geraGrafico("prefeitos_partidos")
