year = 1975

const drawCircle = async ( year  ,el = "#graf") => {
  // Selección de gráfica
  const graf = d3.select(el)
  
  // Carga del dataset
  let dataset = await d3.csv("gapminder.csv", d3.autoType)
  dataset = dataset.filter((d) => d.country == "Spain")
  // console.log(dataset)

  // Dimensiones
  const anchoTotal = +graf.style("width").slice(0, -2)
  const altoTotal = anchoTotal * 0.5

  const margins = { top: 20, right: 20, bottom: 75, left: 100 }

  const alto = altoTotal - margins.top - margins.bottom
  const ancho = anchoTotal - margins.left - margins.right

  // Accessors
  const xAccessor = (d) => d.income
  const yAccessor = (d) => d.life_exp
  const rAccessor = (d) => d.population

  // Variables
  console.log(year)

  // Escaladores
  console.log(Array.from(new Set(dataset.map((d) => d.continent))))
  const color = d3
    .scaleOrdinal()
    .domain(Array.from(new Set(dataset.map((d) => d.continent))))
    .range(["#ff798e", "#33dded", "#99ef33", "#ffec33"])

  const x = d3
    .scaleLog()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, ancho])
  const y = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([alto, 0])
    .nice()
  const r = d3
    .scaleLinear()
    .domain(d3.extent(dataset, rAccessor))
    .range([30, 6000])
    .nice()

  // Espacio de gráfica
  const svg = graf
    .append("svg")
    .classed("graf", true)
    .attr("width", anchoTotal)
    .attr("height", altoTotal)

  const clip = svg
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", ancho)
    .attr("height", alto)

  svg
    .append("g")
    .append("rect")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)
    .attr("width", ancho)
    .attr("height", alto)
    .attr("class", "backdrop")

  const chart = svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)

  const yearLayer = chart
    .append("g")
    .append("text")
    .attr("x", ancho / 2)
    .attr("y", alto / 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .classed("year", true)
    .text(year)

  let newDataset

  const step = (year) => {
    newDataset = dataset.filter((d) => d.year == year)

    // Dibujar los puntos
    const circles = chart
      .selectAll("circle")
      .data(newDataset)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("cx", (d) => x(xAccessor(d)))
            .attr("cy", (d) => y(yAccessor(d)))
            .attr("r", 0)
            .attr("fill", "black")
            .on("mouseenter", function (event, datum) {
              d3.select("#country").text(datum.country)
              d3.select("#country-income").text(datum.income)
              d3.select("#country-lifeexp").text(datum.life_exp)
              d3.select("#country-population").text(datum.population)
              d3.select("#tooltip")
                .style("display", "block")
                .style("top", event.y + 20 + "px")
                .style("left", event.x + 20 + "px")
            })
            .on("mouseout", function (event, datum) {
              d3.select("#tooltip").style("display", "none")
            }),

        (update) => update,
        (exit) =>
          exit.transition().duration(2000).attr("r", 0).attr("fill", "red")
      )
      .transition()
      .duration(2000)
      .attr("r", (d) => Math.sqrt(r(rAccessor(d)) / Math.PI))
      .attr("fill", (d) => color(d.continent))
      .attr("stroke", "#555")
      .attr("opacity", 0.6)
      .attr("clip-path", "url(#clip)")
  }

  // Ejes
  const xAxis = d3
    .axisBottom(x)
    .ticks(3)
    .tickFormat((d) => "$" + d.toLocaleString())
  const yAxis = d3.axisLeft(y)

  const xAxisGroup = chart
    .append("g")
    .attr("transform", `translate(0, ${alto})`)
    .call(xAxis)
    .classed("axis", true)
  const yAxisGroup = chart.append("g").call(yAxis).classed("axis", true)

  xAxisGroup
    .append("text")
    .attr("x", ancho / 2)
    .attr("y", margins.bottom - 10)
    .attr("fill", "black")
    .text("Ingreso Per Cápita")
  yAxisGroup
    .append("text")
    .attr("x", -alto / 2)
    .attr("y", -margins.left + 30)
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .style("transform", "rotate(270deg)")
    .text("Expectativa de Vida")

  step(year)
}



const drawBar = async (graph , year, file, measure, title) => {
  let data = await d3.csv(file, d3.autoType)
  m = measure
  const graf = d3.select(graph)
  const metrica = d3.select("#datayear")

  // Dimensiones
  const margins = {
    top: 50,
    right: 20,
    bottom: 70,
    left: 105,
  }
  const anchoTotal = +graf.style("width").slice(0, -2)
  const altoTotal = (anchoTotal * 9) / 16

  const ancho = anchoTotal - margins.right - margins.left
  const alto = altoTotal - margins.top - margins.bottom

  // Areas de dibujo
  const svg = graf
    .append("svg")
    .attr("width", anchoTotal)
    .attr("height", altoTotal)
    .attr("class", "graf")

  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", ancho)
    .attr("height", alto)
    .attr("transform", `translate(${margins.left}, ${margins.top})`)
    .classed("backdrop", true)

  const g = svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)

  metrica
    .selectAll("option")
    .data(data)
    .enter()
    .append("option")
    .attr("value", (d) => d.year)
    .text((d) => d.year)

  // Accessor
  const xAccessor = (d) => d.year

  // Escaladores
  const x = d3.scaleBand().range([0, ancho]).paddingOuter(0.2).paddingInner(0.1)
  const y = d3.scaleLinear().range([alto, 0])
  const color = d3
    .scaleOrdinal()
    .domain(Object.keys(data))
    .range(d3.schemePastel1)

  // Titulo
  const titulo = g
    .append("text")
    .attr("x", ancho / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .classed("titulo", true)

  // Ejes

  const xAxisGroup = g
    .append("g")
    .attr("transform", `translate(0, ${alto})`)
    .classed("axis", true)


  const yAxisGroup = g.append("g").classed("axis", true)

  const render = (m) => {
    // Accesores
    const yAccessor = (d) => d[m]

    // Ordenamiento de datos
    
    data = data.filter((d) => d.year >= year)

    console.log(data)
    // Escaladores
    const anios = d3.map(data, (d) => d.year)
    x.domain(anios)
    y.domain([0, d3.max(data, yAccessor)])  

    // Dibujo de las barras
      const rect = g
      .selectAll("rect")
      .data(data)
      .join(
        (enter) =>
          enter
          .append("rect")
          .attr("x", (d) => x(xAccessor(d)))
          .attr("y", y(0))
          .attr("width", x.bandwidth())
          .attr("height", 0)
          .attr("fill", "green")
            .on("mouseenter", function (event, datum) {
              d3.select("#country-year").text(datum.year)
              d3.select("#country-period").text(datum.Periodo)
              d3.select("#country-age").text((datum.Edad??'') + (datum.Ambos??''))
              d3.select("#tooltip2")
                .style("display", "block")
                .style("top", event.y + 5 + "px")
                .style("left", event.x + 5 + "px")
            })
            .on("mouseout", function (event, datum) {
              d3.select("#tooltip2").style("display", "none")
            }),

        (update) => update,
        (exit) =>
          exit.transition().duration(2000).attr("fill", "red")
      )
      .transition()
      .duration(2000)
      .attr("x", (d) => x(xAccessor(d)))
      .attr("y", (d) => y(yAccessor(d)))
      .attr("width", x.bandwidth())
      .attr("height", (d) => alto - y(yAccessor(d)))
      .attr("fill", color(m))
      .attr("stroke", "#555")
      .attr("opacity", 0.6)
      .attr("clip-path", "url(#clip)")
      

    // Título
    titulo.text(title)

    // Ejes
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y).ticks(10)
    xAxisGroup.transition().duration(2000).call(xAxis).selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

    yAxisGroup.transition().duration(2000).call(yAxis)
  }

  render(m)
}

const drawLines = async (graph , year) => {
  let data = await d3.csv("nacimientos_defunciones.csv", d3.autoType)
  m = "Nacimientos"
  n = "Defunciones"
  const graf = d3.select(graph)

  // Dimensiones
  const margins = {
    top: 50,
    right: 20,
    bottom: 70,
    left: 105,
  }
  const anchoTotal = +graf.style("width").slice(0, -2)
  const altoTotal = (anchoTotal * 9) / 16

  const ancho = anchoTotal - margins.right - margins.left
  const alto = altoTotal - margins.top - margins.bottom

  // Areas de dibujo
  const svg = graf
    .append("svg")
    .attr("width", anchoTotal)
    .attr("height", altoTotal)
    .attr("class", "graf")

  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", ancho)
    .attr("height", alto)
    .attr("transform", `translate(${margins.left}, ${margins.top})`)
    .classed("backdrop", true)

  const g = svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)

  // Accessor
  const xAccessor = (d) => d.year

  // Escaladores
  const x = d3.scaleLinear().range([0, ancho])
  const y = d3.scaleLinear().range([alto, 0])
  const color = d3
    .scaleOrdinal()
    .domain(Object.keys(data))
    .range(d3.schemePastel1)

  // Titulo
  const titulo = g
    .append("text")
    .attr("x", ancho / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .classed("titulo", true)

  // Ejes

  const xAxisGroup = g
    .append("g")
    .attr("transform", `translate(0, ${alto})`)
    .classed("axis", true)


  const yAxisGroup = g.append("g").classed("axis", true)

  const render = (m) => {
    // Accesores
    const yAccessor = (d) => d[m]

    // Ordenamiento de datos
    
    data = data.filter((d) => d.year >= year)

    console.log(data)
    // Escaladores
    const anios = d3.map(data, (d) => d.year)
    x.domain(anios)
    y.domain([0, d3.max(data, yAccessor)])  

    // Dibujo de las barras
      const rect = g
      .selectAll("rect")
      .data(data)
      .join(
        (enter) =>
          enter
          .append("rect")
          .attr("x", (d) => x(xAccessor(d)))
          .attr("y", y(0))
          .attr("width", x.bandwidth())
          .attr("height", 0)
          .attr("fill", "green")
            .on("mouseenter", function (event, datum) {
              d3.select("#country").text('España')
              d3.select("#country-income").text(datum.year)
              d3.select("#country-lifeexp").text(datum.Periodo)
              d3.select("#country-population").text(datum.Edad)
              d3.select("#tooltip")
                .style("display", "block")
                .style("top", event.y + 20 + "px")
                .style("left", event.x + 20 + "px")
            })
            .on("mouseout", function (event, datum) {
              d3.select("#tooltip").style("display", "none")
            }),

        (update) => update,
        (exit) =>
          exit.transition().duration(2000).attr("fill", "red")
      )
      .transition()
      .duration(2000)
      .attr("x", (d) => x(xAccessor(d)))
      .attr("y", (d) => y(yAccessor(d)))
      .attr("width", x.bandwidth())
      .attr("height", (d) => alto - y(yAccessor(d)))
      .attr("fill", color(m))
      .attr("stroke", "#555")
      .attr("opacity", 0.6)
      .attr("clip-path", "url(#clip)")
      

    // Título
    titulo.text("Edad Media por Año")

    // Ejes
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y).ticks(10)
    xAxisGroup.transition().duration(2000).call(xAxis).selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

    yAxisGroup.transition().duration(2000).call(yAxis)
  }

  render(m)
}

drawall = () => {
  document.getElementById("graf").innerHTML = ""
  document.getElementById("graf2").innerHTML = ""
  document.getElementById("graf3").innerHTML = ""
  document.getElementById("graf4").innerHTML = ""
  drawCircle(year,"#graf")
  drawCircle(year-1,"#graf2")
  drawBar("#graf3", year, "edad_media.csv","Edad","Edad Media por Año")
  drawBar("#graf4", year, "esperanza_de_vida.csv","Ambos","Esperanza de vida por Año")
}

var interval_id = 0;

d3.select("#atras").on("click", () => {
  year--
  drawall()
})
d3.select("#adelante").on("click", () => {
  year++
  drawall()
})
d3.select("#back").on("click", () => {
  interval_id = setInterval(() => {
    document.getElementById("atras").click()
  },3000)
})

d3.select("#play").on("click", () => {
  interval_id = setInterval(() => {
    document.getElementById("adelante").click()
  },3000)
})

d3.select("#pause").on("click", () => {
  clearInterval(interval_id);
})

d3.select("#datayear").on("change", (e) => {
  e.preventDefault()
  year = document.getElementById("datayear").value 
  drawall()
})

drawall()