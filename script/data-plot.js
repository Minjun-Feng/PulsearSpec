let yAxisType = 'log'; // 初始设置为对数刻度
let globalData = null; // 全局变量，用于存储处理后的数据
let projectionXAxisType = 'linear'; // 初始设置为线性坐标
let zColValues = null;

document.getElementById('toggleProjectionXAxis').addEventListener('click', function() {
    projectionXAxisType = projectionXAxisType === 'log' ? 'linear' : 'log'; // 切换坐标类型
    plotProjection(globalData.y, zColValues, projectionXAxisType,'yProjection', 'Projection along Delay');
});
document.getElementById('toggleYAxis').addEventListener('click', function() {
    yAxisType = yAxisType === 'log' ? 'linear' : 'log'; // 切换坐标类型
    plotData(globalData); // 重新绘制图表
});

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

document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
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

    for (let i = 1; i < lines[0].split(',').length; i += blockSize) {
        y.push(parseFloat(lines[0].split(',')[i]));
    }

    for (let i = 1; i < lines.length; i += blockSize) {
        if (lines[i].trim() !== '') {
            let cells = lines[i].split(',').map(Number);
            if (cells.length > 1) {
                x.push(cells[0]);

                let zRow = [];
                for (let k = 1; k < cells.length; k += blockSize) {
                    zRow.push(cells[k]);
                }
                z.push(zRow);
            }
        }
    }
    z = transposeZ(z);
    return { x, y, z };
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
        title: 'CSV Contour Plot',
        xaxis: { title: 'Wavelength / nm' },
        yaxis: { title: 'Delay / ps', type: yAxisType }
    };

    Plotly.newPlot('contourPlot', plotData, layout).then(() => {
        const plotDiv = document.getElementById('contourPlot');
        plotDiv.on('plotly_click', function(clickData) {
            const pts = clickData.points[0];
            const xValue = pts.x;
            const yValue = pts.y;

            // 显示点击的 X 和 Y 值
            document.getElementById('clickedXValue').textContent = xValue.toFixed(2);
            document.getElementById('clickedYValue').textContent = yValue.toFixed(2);

            const xIndex = data.x.findIndex(xVal => xVal === pts.x);
            const yIndex = data.y.findIndex(yVal => yVal === pts.y);

            if (xIndex !== -1 && yIndex !== -1) {
                const zRowValues = data.z[yIndex];
                zColValues = data.z.map(row => row[xIndex]);

                plotProjection(data.x, zRowValues, 'linear','xProjection', 'Projection along Wavelength');
                plotProjection(data.y, zColValues, 'log','yProjection', 'Projection along Delay');
            }
        });
    });
}

function plotProjection(axisValues, zValues,xScaleType, divId, title) {
    const projectionData = [{
        x: axisValues,
        y: zValues,
        type: 'scatter'
    }];

    const layout = {
        title: title,
        xaxis: { type: xScaleType }
    };

    Plotly.newPlot(divId, projectionData, layout);
}

function plotProjectionsAtCenter(data) {
    const xCenterIndex = Math.floor(data.x.length / 2);
    const yCenterIndex = Math.floor(data.y.length / 2);
    const zRowValues = data.z[yCenterIndex];
    zColValues = data.z.map(row => row[xCenterIndex]);

    plotProjection(data.x, zRowValues,'linear', 'xProjection', 'Projection along Wavelength');
    plotProjection(data.y, zColValues, 'linear', 'yProjection', 'Projection along Delay');
}
