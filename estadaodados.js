var width = 956,
    height = 510,
    maxHeight = 510,
    maxSvgHeight = 434, //retirados 40px das abas e 18px do titulo e 17 linha fina
    margin = {top: 5, right: 30, bottom: 20, left: 1}

var barWidth = 956,
    barHeight = 44,
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

                function calculaAlturaSVG(barras){
                    var altura = 43 //Tamanhho da última barra com o exio X
                    for (var i=0; i<barras ; i++)
                        altura += 24;
                    
                    if (altura > maxSvgHeight)
                        return maxSvgHeight
                    else
                        return altura
                }

                var svg = d3.select('#svgEstadaoDados')
                          .attr("height", 0)
                          .attr("width", width)
                
                svg.transition()
                        .duration(duracao)
                        .attr("height",function() { return calculaAlturaSVG(data.length)+'px';})
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
                        .attr("height", function() { return calculaAlturaSVG(data.length)+'px';})
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
    if (!erroEncontrado){
        
        if (projecao=="votos") {
            if (novoJson.indexOf("partidos") != -1) {
                $("#origemDados").text("Veja quantos votos para prefeito cada partido recebeu em 2012 e compare com 2008")
            } else {
                $("#origemDados").text('Veja quantos votos o ' + novoJson.split("_")[1].toUpperCase() + ' recebeu para prefeito em 2012 e compare com 2008')
            }
        } else if (projecao=="eleitorado") {
           if (novoJson.indexOf("partidos") != -1) {
                $("#origemDados").text("Veja o eleitorado que cada partido irá governar em 2012 e compare com 2008")
            } else {
                $("#origemDados").text('Veja o eleitorado que o ' + novoJson.split("_")[1].toUpperCase() + ' irá governar em 2012 e compare com 2008')
            } 
        } else {
            if (novoJson.indexOf("partidos") != -1) {
                $("#origemDados").text("Veja quantos prefeitos cada partido elegeu em 2012 e compare com 2008")
            } else {
                $("#origemDados").text('Veja quantos prefeitos o ' + novoJson.split("_")[1].toUpperCase() + ' elegeu em 2012 e compare com 2008')
            }        
        }
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
    pilhaJson.push(jsonAtual)
    novoGrafico(d.nextlevel)
}

function voltaGrafico(){
    if (pilhaJson.length) {
        var novoJson = pilhaJson.pop()
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

//Funçào que identifica clique nas abas
$("#estadaoDadosAbas li").click( function() {
    esconderAlerta()
    projecao = this.firstChild.id    
    $("#estadaoDadosAbas a.selected").removeClass("selected")
    $(this.firstChild).addClass("selected")
    pilhaJson.length = 0
    $("#estadaoDadosAbas  #origemDados").text("Brasil")
    novoGrafico(projecao+"_partidos")
})

geraGrafico("prefeitos_partidos")
