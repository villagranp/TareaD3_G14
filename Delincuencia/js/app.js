const drawDelincuencia = async (m  = "Homicidios") => {
    let data = await d3.csv('datasetDelincuencia.csv', d3.autoType)
// Selectores (elementos en HTML)
const graf = d3.select("#grafDelincuencia")
const metrica = d3.select("#metricaDelincuencia")

// Dimensiones
const margins = {
    top: 30, 
    right: 20, 
    bottom: 70, 
    left: 75,
}

const anchoTotal = +graf.style("width").slice(0,-2)
const altoTotal = (anchoTotal * 9) / 16
const ancho = anchoTotal - margins.right - margins.left
const alto = altoTotal - margins.top - margins.bottom
const colores = ["yellow","blue"]

// áreas de dibujo
const svg = graf.append("svg")
    .attr("width", anchoTotal)
    .attr("height", altoTotal)
    .attr("class", "graf")

svg.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",ancho)
    .attr("height",alto)
    .attr("transform", `translate(${margins.left}, ${margins.top})`)
    .classed("backdrop",true)

const g = svg.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)

    console.log(data)
    console.log(Object.keys(data[0]).slice(1))

    // Llenar el select (metricas)
    metrica.selectAll("option")
        .data(Object.keys(data[0]).slice(1))
        .enter()
        .append("option")
        .attr("value", (d) => d)
        .text((d) => d)

    //Accessor
    const xAccessor = (d) => d.anio

    //Escaladores
    const x = d3.scaleBand()
    .range([0, ancho])
    .paddingOuter(0.2)
    .paddingInner(0.1)

    const y = d3.scaleLinear()
    .range([alto, 0])

    const color = d3.scaleOrdinal()
        .domain(Object.keys(data[0]).slice(1))
        .range(["#900C3F", "#FF5733"])

    //Ejes x
    const xAxisGroup = g
    .append("g")
    .attr("transform", `translate(0,${alto})`)
    .classed("axis", true)

    //Ejex y
    const yAxisGroup = g.append("g")
    .classed("axis", true)

    //Titulo del gráfico
    const titulo = g.append("text")
    .attr("x", ancho/2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .classed('titulo', true)

    // render() - dibujo
    const render = (m) => {

        //Accessor
        const yAccessor = (d) => d[m]

        //Ordenamiento
        //data.sort((a, b) => b[m] - a[m])

        //Escaladores
        const tipos = d3.map(data, (d) => d.anio)
        x.domain(tipos)
        y.domain([0, d3.max(data, yAccessor)])

        // Dibujo de las barras
        const rect = g.selectAll("rect").data(data)
        rect.enter()
            .append("rect")
            .attr('x', d => x(xAccessor(d)))
            .attr('y', d => y(0))
            .attr('width',x.bandwidth())
            .attr('height', 0)
            .attr("fill", color(m))
            .merge(rect)
            .transition()
            .duration(2000)
            .attr('x', d => x(xAccessor(d)))
            .attr('y', d => y(yAccessor(d)))
            .attr('width',x.bandwidth())
            .attr('height', (d) => alto - y(yAccessor(d)))
            .attr("fill", color(m))

        //Titulo
        titulo.text(m+ " por año")
        // Ejes
        const xAxis = d3.axisBottom(x)        
        const yAxis = d3.axisLeft(y)
        xAxisGroup.transition().duration(2000).call(xAxis)
        yAxisGroup.transition().duration(2000).call(yAxis)


    }

    // Escuchador de eventos
    metrica.on("change", (e) => {
        e.preventDefault()
        console.log(metrica.node().value)
        render(metrica.node().value)
    })

    render(m)
 }

 const drawPensiones = async (m  = "Gasto_total") => {
    let data = await d3.csv('datasetPensiones.csv', d3.autoType)
// Selectores (elementos en HTML)
const graf = d3.select("#grafPensiones")
const metrica = d3.select("#metricaPensiones")

// Dimensiones
const margins = {
    top: 30, 
    right: 20, 
    bottom: 70, 
    left: 75,
}

const anchoTotal = +graf.style("width").slice(0,-2)
const altoTotal = (anchoTotal * 9) / 16
const ancho = anchoTotal - margins.right - margins.left
const alto = altoTotal - margins.top - margins.bottom

// áreas de dibujo
const svg = graf.append("svg")
    .attr("width", anchoTotal)
    .attr("height", altoTotal)
    .attr("class", "graf")

svg.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",ancho)
    .attr("height",alto)
    .attr("transform", `translate(${margins.left}, ${margins.top})`)
    .classed("backdrop",true)

const g = svg.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)

    console.log(data)
    console.log(Object.keys(data[0]).slice(1))

    // Llenar el select (metricas)
    metrica.selectAll("option")
        .data(Object.keys(data[0]).slice(1))
        .enter()
        .append("option")
        .attr("value", (d) => d)
        .text((d) => d)

    //Accessor
    const xAccessor = (d) => d.Anio

    //Escaladores
    const x = d3.scaleBand()
    .range([0, ancho])
    .paddingOuter(0.2)
    .paddingInner(0.1)

    const y = d3.scaleLinear()
    .range([alto, 0])

    const color = d3.scaleOrdinal()
        .domain(Object.keys(data[0]).slice(1))
        .range(d3.schemeCategory10)

    //Ejes x
    const xAxisGroup = g
    .append("g")
    .attr("transform", `translate(0,${alto})`)
    .classed("axis", true)

    //Ejex y
    const yAxisGroup = g.append("g")
    .classed("axis", true)

    //Titulo del gráfico
    const titulo = g.append("text")
    .attr("x", ancho/2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .classed('titulo', true)

    // render() - dibujo
    const render = (m) => {

        //Accessor
        const yAccessor = (d) => d[m]

        //Ordenamiento
        //data.sort((a, b) => b[m] - a[m])

        //Escaladores
        const tipos = d3.map(data, (d) => d.Anio)
        x.domain(tipos)
        y.domain([0, d3.max(data, yAccessor)])

        // Dibujo de las barras
        const rect = g.selectAll("rect").data(data)
        rect.enter()
            .append("rect")
            .attr('x', d => x(xAccessor(d)))
            .attr('y', d => y(0))
            .attr('width',x.bandwidth())
            .attr('height', 0)
            .attr("fill", color(m))
            .merge(rect)
            .transition()
            .duration(2000)
            .attr('x', d => x(xAccessor(d)))
            .attr('y', d => y(yAccessor(d)))
            .attr('width',x.bandwidth())
            .attr('height', (d) => alto - y(yAccessor(d)))
            .attr("fill", color(m))

        //Titulo
        titulo.text("Gastos en millones de euros por "+ m +" en pensiones")
        // Ejes
        const xAxis = d3.axisBottom(x)        
        const yAxis = d3.axisLeft(y)
        xAxisGroup.transition().duration(2000).call(xAxis)
        yAxisGroup.transition().duration(2000).call(yAxis)


    }

    // Escuchador de eventos
    metrica.on("change", (e) => {
        e.preventDefault()
        console.log(metrica.node().value)
        render(metrica.node().value)
    })

    render(m)
 }

 drawall = () => {
    document.getElementById("grafDelincuencia").innerHTML = ""
    document.getElementById("grafPensiones").innerHTML = ""
    drawDelincuencia()
    drawPensiones()
  }

drawall()
 