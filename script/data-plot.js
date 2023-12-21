let yAxisType = 'log'; // 初始设置为对数刻度
let globalData = null; // 全局变量，用于存储处理后的数据
let projectionXAxisType = 'log'; // 初始设置为线性坐标
let zColValues = null;
let zRowValues = null; 
let savedProjectionWavelength = [];
let savedProjectionDelay = [];
let xValue = 0;
let yValue = 0;
//log and linear shift for decay plot
document.getElementById('toggleProjectionXAxis').addEventListener('click', function() {
    var button = this;
    if (button.textContent === 'linear') {
        button.textContent = 'log';
    } else {
        button.textContent = 'linear';
    };
    projectionXAxisType = projectionXAxisType === 'log' ? 'linear' : 'log'; // 切换坐标类型
    plotProjectionY(globalData.y_all, zColValues, projectionXAxisType,'yProjection', savedProjectionDelay );
});
//log and linear shift for TA contour
document.getElementById('toggleYAxis').addEventListener('click', function() {
    var button = this;
    if (button.textContent === 'linear') {
        button.textContent = 'log';
    } else {
        button.textContent = 'linear';
    };
    yAxisType = yAxisType === 'log' ? 'linear' : 'log'; // 切换坐标类型
    plotData(globalData); // 重新绘制图表
});
//save current wavelength plot
document.getElementById('saveProjectionWavelengthCurve').addEventListener('click', function() {
    savedProjectionWavelength.push({ x: globalData.x_all, y: zRowValues, time: yValue.toFixed(2)});
    plotProjectionX(globalData.x_all, zRowValues, 'xProjection',savedProjectionWavelength);
});
//clearing plots
document.getElementById('clearWavelengthProjections').addEventListener('click', function() {
    savedProjectionWavelength = []; // Clear the array
    plotProjectionX(globalData.x_all, zRowValues, 'xProjection',savedProjectionWavelength); // Redraw without saved curves
});
//save current delay plot
document.getElementById('saveProjectionDelayCurve').addEventListener('click', function() {
    savedProjectionDelay.push({ x: globalData.y_all, y: zColValues, wavelength: xValue.toFixed(2)});
    plotProjectionY(globalData.y_all, zColValues, projectionXAxisType,'yProjection',savedProjectionDelay);
});
//clearing delay plots
document.getElementById('clearDelayProjections').addEventListener('click', function() {
    savedProjectionDelay = []; // Clear the array
    plotProjectionY(globalData.y_all, zColValues, projectionXAxisType,'yProjection',savedProjectionDelay); // Redraw without saved curves
});
//save spectrum to clip board
document.getElementById('copyWavelengthData').addEventListener('click', function() {
    let dataString = `Time: ${yValue.toFixed(2)} ps\n${globalData.x_all.join(', ')}\n${zRowValues.join(' ')}\n`;
    savedProjectionWavelength.forEach(projection => {
        const xValues = projection.x.join(', ');
        const yValues = projection.y.join(', ');
        dataString += `Time: ${projection.time} ps\n${xValues}\n${yValues}\n`;
    });
    navigator.clipboard.writeText(dataString)
        .then(() => console.log('Data copied to clipboard!'))
        .catch(err => console.error('Error copying data: ', err));
});
//save decay to clip board
document.getElementById('copyDelayData').addEventListener('click', function() {
    let dataString = `Wavelength: ${xValue.toFixed(2)} nm\n${globalData.y_all.join(', ')}\n${zColValues.join(' ')}\n`;
    savedProjectionDelay.forEach(projection => {
        const xValues = projection.x.join(', ');
        const yValues = projection.y.join(', ');
        dataString += `Wavelength: ${projection.time} ps\n${xValues}\n${yValues}\n`;
    });
    navigator.clipboard.writeText(dataString)
        .then(() => console.log('Data copied to clipboard!'))
        .catch(err => console.error('Error copying data: ', err));
});

//Load initial data
document.addEventListener('DOMContentLoaded', function() {
    fetch('data/Example_MAPbI3.csv')
        .then(response => response.text())
        .then(data => {
            globalData = processCSV(data);
            plotData(globalData);
            plotProjectionsAtCenter(globalData); // 绘制中心点的投影图
        })
        .catch(error => console.error('Error fetching the file:', error));
});
//load csv file from loacal storage
document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('fileNameDisplay').textContent = `File: ${file.name}`;
    }
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        globalData  = processCSV(text);
        plotData(globalData);
    };

    reader.readAsText(file);
});

function processCSV(csvText) {
    const blockSize = 2;
    let fileInfoIndex = csvText.indexOf('file info');
    if (fileInfoIndex !== -1) {
        csvText = csvText.substring(0, fileInfoIndex);
    }

    const lines = csvText.split('\n');
    let x = [], y = [], z = [];
    let x_all = [], z_all = [];

    let y_all = lines[0].split(',').slice(1).map(element => parseFloat(element));

    for (let i = 1; i < lines[0].split(',').length; i += blockSize) {
        y.push(parseFloat(lines[0].split(',')[i]));
    }
    

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() !== '') {
            let cells = lines[i].split(',').map(Number);
            if (cells.length > 1) {
                // 存储不间隔的所有数据
                x_all.push(cells[0]);
                z_all.push(cells.slice(1));
    
                // 按照 blockSize 间隔存储数据
                if (i % blockSize === 1) {  // 只在 blockSize 的倍数索引处处理数据
                    x.push(cells[0]);
    
                    let zRow = [];
                    for (let k = 1; k < cells.length; k += blockSize) {
                        zRow.push(cells[k]);
                    }
                    z.push(zRow);
                }
            }
        }
    }
    z = transposeZ(z);
    z_all = transposeZ(z_all);
    return { x, y, z, x_all, y_all, z_all };
}

function transposeZ(z) {
    if (z.length === 0 || z[0].length === 0) {
        return []; // 如果 z 是空的或者第一行为空，则返回空数组
    }

    // 创建一个新数组，其行数等于原始数组的列数，列数等于原始数组的行数
    let transposed = [];
    for (let i = 0; i < z[0].length; i++) {
        transposed.push([]);
        for (let j = 0; j < z.length; j++) {
            transposed[i].push(z[j][i]);
        }
    }
    return transposed;
}
 //x is delya, y is wavelength
function plotData(data) {
    const plotData = [{
        x: data.x,
        y: data.y,
        z: data.z,
        type: 'contour',
    }];

    const layout = {
        title: 'TA Contour Plot',
        xaxis: { title: 'Wavelength / nm' },
        yaxis: { title: 'Delay / ps', type: yAxisType }
    };

    Plotly.newPlot('contourPlot', plotData, layout).then(() => {
        const plotDiv = document.getElementById('contourPlot');
        plotDiv.on('plotly_click', function(clickData) {
            const pts = clickData.points[0];
            xValue = pts.x;
            yValue = pts.y;

            const xIndex = data.x_all.findIndex(xVal => xVal === pts.x);
            const yIndex = data.y_all.findIndex(yVal => yVal === pts.y);

            if (xIndex !== -1 && yIndex !== -1) {
                zRowValues = data.z_all[yIndex];
                zColValues = data.z_all.map(row => row[xIndex]);

                plotProjectionX(data.x_all, zRowValues,'xProjection',savedProjectionWavelength);
                plotProjectionY(data.y_all, zColValues, projectionXAxisType,'yProjection',savedProjectionDelay );
            }
        });
    });
}
//Plot spectrum
function plotProjectionX(axisValues, zValues, divId, savedProjectionData) {
    const projectionData = [{
        x: axisValues,
        y: zValues,
        type: 'scatter',
        name: `${yValue.toFixed(2)} ps`,
    }];
    // Plot the saved curve if it exists
    if (savedProjectionData) {
            // Plot each saved curve
        savedProjectionData.forEach((data) => {
            projectionData.push({
                x: data.x,
                y: data.y,
                type: 'scatter',
                name: `${data.time} ps`
            });
        });
    }

    const layout = {
        title: 'Projection along Wavelength',
        xaxis: { type: 'linear' ,title: 'Wavelength / nm'},
        showlegend: true,
    };

    Plotly.newPlot(divId, projectionData, layout);
}
//Plot delay dynamics
function plotProjectionY(axisValues, zValues, xScaleType, divId, savedProjectionData) {
    const projectionData = [{
        x: axisValues,
        y: zValues,
        type: 'scatter',
        name: `${xValue.toFixed(2)} nm`,
    }];
    // Plot the saved curve if it exists
    if (savedProjectionData) {
            // Plot each saved curve
        savedProjectionData.forEach((data) => {
            projectionData.push({
                x: data.x,
                y: data.y,
                type: 'scatter',
                name: `${data.wavelength} nm`,
            });
        });
    }
    const layout = {
        title: 'Projection along Delay',
        xaxis: { type: xScaleType ,title: 'Delay / ps'},
        showlegend: true,
    };

    Plotly.newPlot(divId, projectionData, layout);
}
function plotProjectionsAtCenter(data) {
    const xCenterIndex = Math.floor(data.x_all.length / 2);
    const yCenterIndex = Math.floor(data.y_all.length / 2);
    xValue = data.x_all[xCenterIndex];
    yValue = data.y_all[yCenterIndex];
    zRowValues = data.z_all[yCenterIndex];
    zColValues = data.z_all.map(row => row[xCenterIndex]);

    plotProjectionX(data.x_all, zRowValues, 'xProjection');
    plotProjectionY(data.y_all, zColValues, 'log','yProjection' );
}
