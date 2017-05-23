//note that this file is not yet ready at all for deployment because there is residual node stuff

var xArr = []
var yArr = []
var polyOrder = 1;
var coeffTable = []
var coeffArr = []
var totalArr = []
 
function formatData(text, concat) {
  var data = text.split(concat).map(Number)
  if (data.includes(NaN) || data.includes(Infinity) || data.includes (-Infinity))
    return false
  return data
}

function formatEquation(c) {
  var eq = 'Equation: '
  for (var ii = 0; ii < c.length; ii++) {
    if (c[ii] != 0) { //if the value needs to be printed
      if (c[ii] < 0) { //if the coeff is less than zero
        if (ii == 0) { //if its the first term
          eq += c[ii] + '*x^' + (c.length-ii-1)
        } else if (ii == c.length-1) {
          eq += ' - ' + Math.abs(c[ii])
        } else {
          eq += ' - ' + Math.abs(c[ii]) + '*x^' + (c.length-ii-1)
        }
      }
      if (c[ii] > 0) { //if the coeff is less than zero
        if (ii == 0) { //if its the first term
          eq += c[ii] + '*x^' + (c.length-ii-1)
        } else if (ii == c.length-1) {
          eq += ' + ' + c[ii]
        } else {
          eq += ' + ' + c[ii] + '*x^' + (c.length-ii-1)
        }
      }
    }
  }
  eq = eq + ' = 0'
  return eq
}
function calculateLeastSquares(xData, yData, order) {
  polyOrder = (order)
  xArr = xData
  yArr = yData
  
  
  if (xArr.length > 2 && yArr.length > 2) {
    populateCoeff(printCoeff)
    //console.log(coeffTable)
    var inverseMatrix = matrixInverse(coeffTable)
    var c = multiply(inverseMatrix, totalArr)
  
    //console.log('coefficients: ' + coefficients.join(', '))
    var corrC = corrCoeff(xArr, yArr, c)
    xArr = []
    yArr = []
    coeffTable = []
    coeffArr = []
    totalArr = []

    
    return formatEquation(c) + '&emsp; Correlation Coefficent: ' + corrC
  
  }
}

//each value in the array should be the values A, B, C, etc. in ds/da if ds/da = Aa + Bb + Cc ...
//we have to get a bunch of equations and then solve those equations for the coefficients
//until we make this user robust

//this is just a helper method for summations
function sumSquare(arr1,arr2,power1,power2) {
  var sum = 0;
  for (var ii = 0; ii < arr1.length; ii++) {
    sum += Math.pow(arr1[ii],power1) * Math.pow(arr2[ii],power2);
  }
  return sum;
}

//populate the coeffTable which will be used to calculate the desired coefficients (a, b, c, etc.)
function populateCoeff(_callback) {
  console.log(coeffTable)
  for (var ii = polyOrder*2; ii >= 0; ii--) {
    coeffArr.push(sumSquare(xArr,new Array(xArr.length+1).join('0').split('').map(parseFloat),ii,0))
  }
  _callback();
}

//part of populate coeff
function printCoeff() {
  var total = 0
  for (var ii = 0; ii < polyOrder + 1; ii++) {
    coeffTable.push([]);
    total = sumSquare(xArr,yArr,polyOrder-ii,1)
    for (var jj = 0; jj < polyOrder + 1; jj++) {
      coeffTable[ii][jj] = coeffArr[ii+jj]
    }
    totalArr.push(total)
  }
}

//generate the inverse matrix of a matrix
function matrixInverse(inMatrix) {
  var det = determinant(inMatrix)
  console.log(det)
  if (inMatrix.length == 2) {
    return [[inMatrix[1][1]/det,-inMatrix[1][0]/det],[-inMatrix[0][1]/det,inMatrix[0][0]/det]]
  } else {
    var finalMatrix = matrixOfMinors(inMatrix)
    finalMatrix = matrixOfCofactors(finalMatrix)
    finalMatrix = transpose(finalMatrix)
    finalMatrix = divDet(finalMatrix, det)
  }
  return finalMatrix
}

//get the "matrix of minors" of a given matrix
function matrixOfMinors(matrix) {
  var newMatrix = []
  for (var ii = 0; ii < matrix.length; ii++) {
    newMatrix.push([])
    for (var jj = 0; jj < matrix[ii].length; jj++) {
      newMatrix[ii].push(determinant(minor(matrix, ii, jj)))
    }
  }
  return newMatrix
}

//get the "minor" of a matrix position
function minor(matrix, row, col) {
  var minor = []
  for (var ii = 0; ii < matrix.length; ii++) {
    if (row != ii) {
      minor.push([])
    }
    for (var jj = 0; jj < matrix[ii].length; jj++) {
      if (ii != row && jj != col) {
        minor[minor.length-1].push(matrix[ii][jj])
      } else {
        //do nothing
      }
    }
  }
  return minor;
}

//get the determinant of a matrix
function determinant(matrix) {
  //console.log(matrix)
  if (matrix.length < 3) {
    return matrix[0][0]*matrix[1][1] - matrix[0][1]*matrix[1][0]
  } else {
    var det = 0
    var val = 0
    for (var ii = 0; ii < matrix.length; ii++) {
      val = matrix[0][ii]*determinant(minor(matrix, 0, ii))
      if (ii%2 != 0) {
        val *= -1
      }
      det += val
      //console.log(val)
    }
  }
  return det
}

//return the matrix of cofactors
function matrixOfCofactors(matrix) {
  for (ii = 0; ii < matrix.length; ii++) {
    for (jj = 0; jj < matrix[ii].length; jj++) {
      if ((ii + jj)%2 != 0) {
        matrix[ii][jj] *= -1
      }
    }
  }
  return matrix
}

//to transpose a matrix
function transpose(matrix) {
  var newMatrix = []
  for (var ii = 0; ii < matrix.length; ii++) {
    newMatrix.push([])
    for (var jj = 0; jj < matrix.length; jj++) {
      newMatrix[ii].push(matrix[jj][ii])
    }
  }
  return newMatrix
}

//divide a matrix by some determinant
function divDet(matrix, det) {
  for (var ii = 0; ii < matrix.length; ii++) {
    for (var jj = 0; jj < matrix.length; jj++) {
      matrix[ii][jj] = matrix[ii][jj]/det
    }
  }
  return matrix
}

//to multiply a matrix and vector together
function multiply(matrix, vector) {
  var newVector = []
  for (var ii = 0; ii < matrix.length; ii++) {
    var total = 0;
    for (var jj = 0; jj < vector.length; jj++) {
      total += matrix[ii][jj]*vector[jj];
    }
    newVector.push(Math.round(total*10000)/10000)
  }
  return newVector
}

//to calculate the correlation coefficient using the formula found on this website: 
//http://www.hedgefund-index.com/d_rsquared.asp
function corrCoeff(xArr, yArr, coeffs) {
  var sse = 0;
  var sst = 0;
  var yMean = sumSquare(yArr, [], 1, 0)/yArr.length
  for (var ii = 0; ii < xArr.length; ii++) {
    var yhat = 0;
    for (var jj = 0; jj < coeffs.length; jj++) {
      yhat += coeffs[jj] * Math.pow(xArr[ii], coeffs.length - jj - 1)
    }
    sse += Math.pow((yArr[ii] - yhat), 2)
    sst += Math.pow((yArr[ii] - yMean), 2)
  }
  //console.log('sse: ' + sse)
  //console.log('sst: ' + sst)
  return (Math.round((1 - sse/sst)*1000000)/1000000)
}