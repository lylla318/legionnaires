

$(document).ready(function() {

  //drawLineTaxIncreases();
  //drawLineMedianIncome();
  drawLinePercentHispanic();

});













function drawLineTaxIncreases() {

  var margin = {top: 60, right: 20, bottom: 80, left: 60};
  var width = 450, height = 200;

  var svg = d3.select(".chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#FFFFFF");


  var g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // var parseTime = d3.timeParse("%d-%b-%y");
  var parseTime = d3.timeParse("%Y");

  var x = d3.scaleTime()
      .rangeRound([0, width]);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

  // d3.csv("data/cooling_towers_data.csv", function(d) {
  d3.csv("data/inwood_tax_increases.csv", function(d) {
    d.date = parseTime(d.date);
    d.close = +d.close;
    return d;
  }, function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([-2,10]);

    var dollarFormat = function(d) { return '$' + d3.format('.0f')(d/1000) + "K"};

    console.log(d3.extent(data, function(d) { return d.date; }))

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(12).tickFormat(d3.timeFormat("%Y")))
        .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

    g.append("g")
        .call(d3.axisLeft(y).ticks(6).tickFormat(d => d + "%"))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .style("font-size", 12)
      
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#551A8B")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("d", line);

    // chart title
    g.append("text")             
      .attr("transform",
            "translate(" + (width/2-10) + " ," + -40 + ")")
      .style("text-anchor", "middle")
      .style("font-size", 16)
      .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .style("fill","black")
      .text("Commercial Property Tax Increases" );

  // chart title
  g.append("text")             
    .attr("transform",
          "translate(" + (width/2-10) + " ," + -15 + ")")
    .style("text-anchor", "middle")
    .style("font-size", 16)
    .style("font-weight", "bold")
    .style("font-family","MarkPro")
    .style("fill","black")
    .text("Inwood, 2010-2018" );

  // text label for the x axis
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2 + 40) + " ," + 
                           (height + margin.top + 60 ) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 12)
      // .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .text("Year");

  // text label for the y0 axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", -170)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", 12)
      .style("font-family","MarkPro")
      .text("Percent Increase (%)");  




// Set-up the export button
d3.select('#saveButton').on('click', function(){
  console.log("here")
  var svgString = getSVGString(svg.node());
  svgString2Image( svgString, 2*(width+margin.left+margin.right), 2*(height+margin.top+margin.bottom), 'jpeg', save ); // passes Blob and filesize String to the callback

  function save( dataBlob, filesize ){
    saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
  }
});


// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString( svgNode ) {
  svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
  var cssStyleText = getCSSStyles( svgNode );
  appendCSS( cssStyleText, svgNode );

  var serializer = new XMLSerializer();
  var svgString = serializer.serializeToString(svgNode);
  svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
  svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

  return svgString;

  function getCSSStyles( parentElement ) {
    var selectorTextArr = [];

    // Add Parent element Id and Classes to the list
    selectorTextArr.push( '#'+parentElement.id );
    for (var c = 0; c < parentElement.classList.length; c++)
        if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
          selectorTextArr.push( '.'+parentElement.classList[c] );

    // Add Children element Ids and Classes to the list
    var nodes = parentElement.getElementsByTagName("*");
    for (var i = 0; i < nodes.length; i++) {
      var id = nodes[i].id;
      if ( !contains('#'+id, selectorTextArr) )
        selectorTextArr.push( '#'+id );

      var classes = nodes[i].classList;
      for (var c = 0; c < classes.length; c++)
        if ( !contains('.'+classes[c], selectorTextArr) )
          selectorTextArr.push( '.'+classes[c] );
    }

    // Extract CSS Rules
    var extractedCSSText = "";
    for (var i = 0; i < document.styleSheets.length; i++) {
      var s = document.styleSheets[i];
      
      try {
          if(!s.cssRules) continue;
      } catch( e ) {
            if(e.name !== 'SecurityError') throw e; // for Firefox
            continue;
          }

      var cssRules = s.cssRules;
      for (var r = 0; r < cssRules.length; r++) {
        if ( contains( cssRules[r].selectorText, selectorTextArr ) )
          extractedCSSText += cssRules[r].cssText;
      }
    }
    

    return extractedCSSText;

    function contains(str,arr) {
      return arr.indexOf( str ) === -1 ? false : true;
    }

  }

  function appendCSS( cssText, element ) {
    var styleElement = document.createElement("style");
    styleElement.setAttribute("type","text/css"); 
    styleElement.innerHTML = cssText;
    var refNode = element.hasChildNodes() ? element.children[0] : null;
    element.insertBefore( styleElement, refNode );
  }
}


function svgString2Image( svgString, width, height, format, callback ) {
  var format = format ? format : 'png';

  var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  var image = new Image();
  image.onload = function() {
    context.clearRect ( 0, 0, width, height );
    context.drawImage(image, 0, 0, width, height);
    // context.fillStyle = "white"

    canvas.toBlob( function(blob) {
      var filesize = Math.round( blob.length/1024 ) + ' KB';
      if ( callback ) callback( blob, filesize );
    });

    
  };

  image.src = imgsrc;
}




  })}




















function drawLineMedianIncome() {

  var margin = {top: 60, right: 20, bottom: 80, left: 60};
  var width = 450, height = 200;

  var svg = d3.select(".chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#FFFFFF");


  var g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // var parseTime = d3.timeParse("%d-%b-%y");
  var parseTime = d3.timeParse("%Y");

  var x = d3.scaleTime()
      .rangeRound([0, width]);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

  // d3.csv("data/cooling_towers_data.csv", function(d) {
  d3.csv("data/inwood_income.csv", function(d) {
    d.date = parseTime(d.date);
    d.close = +d.close;
    return d;
  }, function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0,60000]);

    var dollarFormat = function(d) { return '$' + d3.format('.0f')(d/1000) + "K"};

    console.log(d3.extent(data, function(d) { return d.date; }))

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(12).tickFormat(d3.timeFormat("%Y")))
        .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

    g.append("g")
        .call(d3.axisLeft(y).ticks(6).tickFormat(d3.format(".1s")))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .style("font-size", 12)
      
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#551A8B")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("d", line);

    // chart title
    g.append("text")             
      .attr("transform",
            "translate(" + (width/2-10) + " ," + -40 + ")")
      .style("text-anchor", "middle")
      .style("font-size", 16)
      .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .style("fill","black")
      .text("Median Income" );

  // chart title
  g.append("text")             
    .attr("transform",
          "translate(" + (width/2-10) + " ," + -15 + ")")
    .style("text-anchor", "middle")
    .style("font-size", 16)
    .style("font-weight", "bold")
    .style("font-family","MarkPro")
    .style("fill","black")
    .text("Community District 12, 2010-2016" );

  // text label for the x axis
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2 + 40) + " ," + 
                           (height + margin.top + 60 ) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 12)
      // .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .text("Year");

  // text label for the y0 axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", -170)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", 12)
      // .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .text("Median Income ($)");  




// Set-up the export button
d3.select('#saveButton').on('click', function(){
  console.log("here")
  var svgString = getSVGString(svg.node());
  svgString2Image( svgString, 2*(width+margin.left+margin.right), 2*(height+margin.top+margin.bottom), 'jpeg', save ); // passes Blob and filesize String to the callback

  function save( dataBlob, filesize ){
    saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
  }
});


// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString( svgNode ) {
  svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
  var cssStyleText = getCSSStyles( svgNode );
  appendCSS( cssStyleText, svgNode );

  var serializer = new XMLSerializer();
  var svgString = serializer.serializeToString(svgNode);
  svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
  svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

  return svgString;

  function getCSSStyles( parentElement ) {
    var selectorTextArr = [];

    // Add Parent element Id and Classes to the list
    selectorTextArr.push( '#'+parentElement.id );
    for (var c = 0; c < parentElement.classList.length; c++)
        if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
          selectorTextArr.push( '.'+parentElement.classList[c] );

    // Add Children element Ids and Classes to the list
    var nodes = parentElement.getElementsByTagName("*");
    for (var i = 0; i < nodes.length; i++) {
      var id = nodes[i].id;
      if ( !contains('#'+id, selectorTextArr) )
        selectorTextArr.push( '#'+id );

      var classes = nodes[i].classList;
      for (var c = 0; c < classes.length; c++)
        if ( !contains('.'+classes[c], selectorTextArr) )
          selectorTextArr.push( '.'+classes[c] );
    }

    // Extract CSS Rules
    var extractedCSSText = "";
    for (var i = 0; i < document.styleSheets.length; i++) {
      var s = document.styleSheets[i];
      
      try {
          if(!s.cssRules) continue;
      } catch( e ) {
            if(e.name !== 'SecurityError') throw e; // for Firefox
            continue;
          }

      var cssRules = s.cssRules;
      for (var r = 0; r < cssRules.length; r++) {
        if ( contains( cssRules[r].selectorText, selectorTextArr ) )
          extractedCSSText += cssRules[r].cssText;
      }
    }
    

    return extractedCSSText;

    function contains(str,arr) {
      return arr.indexOf( str ) === -1 ? false : true;
    }

  }

  function appendCSS( cssText, element ) {
    var styleElement = document.createElement("style");
    styleElement.setAttribute("type","text/css"); 
    styleElement.innerHTML = cssText;
    var refNode = element.hasChildNodes() ? element.children[0] : null;
    element.insertBefore( styleElement, refNode );
  }
}


function svgString2Image( svgString, width, height, format, callback ) {
  var format = format ? format : 'png';

  var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  var image = new Image();
  image.onload = function() {
    context.clearRect ( 0, 0, width, height );
    context.drawImage(image, 0, 0, width, height);
    // context.fillStyle = "white"

    canvas.toBlob( function(blob) {
      var filesize = Math.round( blob.length/1024 ) + ' KB';
      if ( callback ) callback( blob, filesize );
    });

    
  };

  image.src = imgsrc;
}




  })}






















function drawLinePercentHispanic() {

  var margin = {top: 60, right: 20, bottom: 80, left: 60};
  var width = 450, height = 200;

  var svg = d3.select(".chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#FFFFFF");


  var g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // var parseTime = d3.timeParse("%d-%b-%y");
  var parseTime = d3.timeParse("%Y");

  var x = d3.scaleTime()
      .rangeRound([0, width]);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

  // d3.csv("data/cooling_towers_data.csv", function(d) {
  d3.csv("data/inwood_hispanic.csv", function(d) {
    d.date = parseTime(d.date);
    d.close = +d.close;
    return d;
  }, function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([64,75]);

    var dollarFormat = function(d) { return '$' + d3.format('.0f')(d/1000) + "K"};

    console.log(d3.extent(data, function(d) { return d.date; }))

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(12).tickFormat(d3.timeFormat("%Y")))
        .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

    g.append("g")
        .call(d3.axisLeft(y).tickFormat(d => d + "%"))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .style("font-size", 12)
      
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#551A8B")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("d", line);

    // chart title
    g.append("text")             
      .attr("transform",
            "translate(" + (width/2-10) + " ," + -40 + ")")
      .style("text-anchor", "middle")
      .style("font-size", 16)
      .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .style("fill","black")
      .text("Percent Hispanic Origin" );

  // chart title
  g.append("text")             
    .attr("transform",
          "translate(" + (width/2-10) + " ," + -15 + ")")
    .style("text-anchor", "middle")
    .style("font-size", 16)
    .style("font-weight", "bold")
    .style("font-family","MarkPro")
    .style("fill","black")
    .text("Community District 12, 2010-2016" );

  // text label for the x axis
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2 + 40) + " ," + 
                           (height + margin.top + 60 ) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 12)
      // .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .text("Year");

  // text label for the y0 axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", -170)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", 12)
      // .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .text("Percent Hispanic");  




// Set-up the export button
d3.select('#saveButton').on('click', function(){
  console.log("here")
  var svgString = getSVGString(svg.node());
  svgString2Image( svgString, 2*(width+margin.left+margin.right), 2*(height+margin.top+margin.bottom), 'jpeg', save ); // passes Blob and filesize String to the callback

  function save( dataBlob, filesize ){
    saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
  }
});


// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString( svgNode ) {
  svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
  var cssStyleText = getCSSStyles( svgNode );
  appendCSS( cssStyleText, svgNode );

  var serializer = new XMLSerializer();
  var svgString = serializer.serializeToString(svgNode);
  svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
  svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

  return svgString;

  function getCSSStyles( parentElement ) {
    var selectorTextArr = [];

    // Add Parent element Id and Classes to the list
    selectorTextArr.push( '#'+parentElement.id );
    for (var c = 0; c < parentElement.classList.length; c++)
        if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
          selectorTextArr.push( '.'+parentElement.classList[c] );

    // Add Children element Ids and Classes to the list
    var nodes = parentElement.getElementsByTagName("*");
    for (var i = 0; i < nodes.length; i++) {
      var id = nodes[i].id;
      if ( !contains('#'+id, selectorTextArr) )
        selectorTextArr.push( '#'+id );

      var classes = nodes[i].classList;
      for (var c = 0; c < classes.length; c++)
        if ( !contains('.'+classes[c], selectorTextArr) )
          selectorTextArr.push( '.'+classes[c] );
    }

    // Extract CSS Rules
    var extractedCSSText = "";
    for (var i = 0; i < document.styleSheets.length; i++) {
      var s = document.styleSheets[i];
      
      try {
          if(!s.cssRules) continue;
      } catch( e ) {
            if(e.name !== 'SecurityError') throw e; // for Firefox
            continue;
          }

      var cssRules = s.cssRules;
      for (var r = 0; r < cssRules.length; r++) {
        if ( contains( cssRules[r].selectorText, selectorTextArr ) )
          extractedCSSText += cssRules[r].cssText;
      }
    }
    

    return extractedCSSText;

    function contains(str,arr) {
      return arr.indexOf( str ) === -1 ? false : true;
    }

  }

  function appendCSS( cssText, element ) {
    var styleElement = document.createElement("style");
    styleElement.setAttribute("type","text/css"); 
    styleElement.innerHTML = cssText;
    var refNode = element.hasChildNodes() ? element.children[0] : null;
    element.insertBefore( styleElement, refNode );
  }
}


function svgString2Image( svgString, width, height, format, callback ) {
  var format = format ? format : 'png';

  var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  var image = new Image();
  image.onload = function() {
    context.clearRect ( 0, 0, width, height );
    context.drawImage(image, 0, 0, width, height);
    // context.fillStyle = "white"

    canvas.toBlob( function(blob) {
      var filesize = Math.round( blob.length/1024 ) + ' KB';
      if ( callback ) callback( blob, filesize );
    });

    
  };

  image.src = imgsrc;
}




  })}












function drawLineChartLegionaires() {

  var margin = {top: 60, right: 20, bottom: 80, left: 60};
  var width = 550, height = 200;

  var svg = d3.select(".chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#FFFFFF");


  var g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // var parseTime = d3.timeParse("%d-%b-%y");
  var parseTime = d3.timeParse("%b-%y");

  var x = d3.scaleTime()
      .rangeRound([0, width]);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

  // d3.csv("data/cooling_towers_data.csv", function(d) {
  d3.csv("data/legionnaires.csv", function(d) {
    d.date = parseTime(d.date);
    d.close = +d.close;
    return d;
  }, function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.close; }));

    var dollarFormat = function(d) { return '$' + d3.format('.0f')(d/1000) + "K"};

    console.log(d3.extent(data, function(d) { return d.date; }))

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(12).tickFormat(d3.timeFormat("%b-%Y")))
        .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

    g.append("g")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .style("font-size", 12)
      
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#551A8B")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("d", line);

    // chart title
    g.append("text")             
      .attr("transform",
            "translate(" + (width/2-10) + " ," + -40 + ")")
      .style("text-anchor", "middle")
      .style("font-size", 16)
      .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .style("fill","black")
      .text("Last Inspection Date for Non-Compliant Cooling Towers" );

  // text label for the x axis
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2 + 40) + " ," + 
                           (height + margin.top + 75 ) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 12)
      // .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .text("Date of Last Inspection");

  // text label for the y0 axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", -170)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", 12)
      // .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .text("Number of Inspections");  




// Set-up the export button
d3.select('#saveButton').on('click', function(){
  console.log("here")
  var svgString = getSVGString(svg.node());
  svgString2Image( svgString, 2*(width+margin.left+margin.right), 2*(height+margin.top+margin.bottom), 'jpeg', save ); // passes Blob and filesize String to the callback

  function save( dataBlob, filesize ){
    saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
  }
});


// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString( svgNode ) {
  svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
  var cssStyleText = getCSSStyles( svgNode );
  appendCSS( cssStyleText, svgNode );

  var serializer = new XMLSerializer();
  var svgString = serializer.serializeToString(svgNode);
  svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
  svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

  return svgString;

  function getCSSStyles( parentElement ) {
    var selectorTextArr = [];

    // Add Parent element Id and Classes to the list
    selectorTextArr.push( '#'+parentElement.id );
    for (var c = 0; c < parentElement.classList.length; c++)
        if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
          selectorTextArr.push( '.'+parentElement.classList[c] );

    // Add Children element Ids and Classes to the list
    var nodes = parentElement.getElementsByTagName("*");
    for (var i = 0; i < nodes.length; i++) {
      var id = nodes[i].id;
      if ( !contains('#'+id, selectorTextArr) )
        selectorTextArr.push( '#'+id );

      var classes = nodes[i].classList;
      for (var c = 0; c < classes.length; c++)
        if ( !contains('.'+classes[c], selectorTextArr) )
          selectorTextArr.push( '.'+classes[c] );
    }

    // Extract CSS Rules
    var extractedCSSText = "";
    for (var i = 0; i < document.styleSheets.length; i++) {
      var s = document.styleSheets[i];
      
      try {
          if(!s.cssRules) continue;
      } catch( e ) {
            if(e.name !== 'SecurityError') throw e; // for Firefox
            continue;
          }

      var cssRules = s.cssRules;
      for (var r = 0; r < cssRules.length; r++) {
        if ( contains( cssRules[r].selectorText, selectorTextArr ) )
          extractedCSSText += cssRules[r].cssText;
      }
    }
    

    return extractedCSSText;

    function contains(str,arr) {
      return arr.indexOf( str ) === -1 ? false : true;
    }

  }

  function appendCSS( cssText, element ) {
    var styleElement = document.createElement("style");
    styleElement.setAttribute("type","text/css"); 
    styleElement.innerHTML = cssText;
    var refNode = element.hasChildNodes() ? element.children[0] : null;
    element.insertBefore( styleElement, refNode );
  }
}


function svgString2Image( svgString, width, height, format, callback ) {
  var format = format ? format : 'png';

  var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  var image = new Image();
  image.onload = function() {
    context.clearRect ( 0, 0, width, height );
    context.drawImage(image, 0, 0, width, height);
    // context.fillStyle = "white"

    canvas.toBlob( function(blob) {
      var filesize = Math.round( blob.length/1024 ) + ' KB';
      if ( callback ) callback( blob, filesize );
    });

    
  };

  image.src = imgsrc;
}




  })}
















function drawLineChart2() {
  // set the dimensions and margins of the graph
  var margin = {top: 40, right: 100, bottom: 150, left: 100},
      width = 750 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse("%Y");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y0 = d3.scaleLinear().range([height, 0]);
  var y1 = d3.scaleLinear().range([height, 0]);

  // gridlines in x axis function
  function make_x_gridlines() {   
      return d3.axisBottom(x)
          .ticks(10)
  }

  // gridlines in y axis function
  function make_y_gridlines() {   
      return d3.axisLeft(y0)
          .ticks(10)
  }

  // define the 1st line
  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y0(d.avgProfit); });

  // define the 2nd line
  var valueline2 = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y1(d.flipCount); });

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(".chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.csv("data/profit-trends.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d.date = parseTime(parseInt(d.date));
        d.avgProfit = +d.avgProfit;
        d.flipCount = +d.flipCount;
    });

    //console.log(data)

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y0.domain([0, d3.max(data, function(d) {return Math.max(d.avgProfit);})]);
    y1.domain([0, d3.max(data, function(d) {return Math.max(d.flipCount); })]);

    var dollarFormat = function(d) { return '$' + d3.format('.0f')(d/1000) + "K"};

    // add the X gridlines
    svg.append("g")     
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )

    // add the Y gridlines
    svg.append("g")     
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline)
        .style("stroke", "#FFA500")
        .style("stroke-width", 2)
        .attr("fill","none");

    // Add the valueline2 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#DE1E3D")
        .style("stroke-width", 2)
        .attr("d", valueline2)
        .attr("fill","none");

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // text label for the x axis
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 10 ) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 12)
      .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .text("Year");

    // chart title
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           -30 + ")")
      .style("text-anchor", "middle")
      .style("font-size", 14)
      .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .text("House Flipping Occurrances and Resale Profits, 2003-2017" );


    // Add the Y0 Axis
    svg.append("g")
        .attr("class", "axisSteelBlue")
        .call(d3.axisLeft(y0)
              .tickFormat(dollarFormat));

    // text label for the y0 axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 25)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", 12)
      .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .text("Average Resale Profit");    

    // Add the Y1 Axis
    svg.append("g")
        .attr("class", "axisRed")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(d3.axisRight(y1));

    // text label for the y1 axis
    svg.append("text")
      .attr("transform", "rotate(90)")
      .attr("y", -620)
      .attr("x", 150)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", 12)
      .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .text("Number of Flips");   1

    svg.append("text")
      .attr("x", -55)
      .attr("y", 5)
      .style("font-size", 12)
      .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .style("fill","#DE1E3D")
      .attr("transform", "translate(30,90) rotate(-74)")
      .text("flip number");

    svg.append("text")
      .attr("x", -55)
      .attr("y", 5)
      .style("font-size", 12)
      .style("font-weight", "bold")
      .style("font-family","MarkPro")
      .style("fill","#FFA500")
      .attr("transform", "translate(95,160) rotate(-25)")
      .text("avg. resale profit");

  });
}

