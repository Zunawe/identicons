import identicon from 'svg-identicon'
import md5 from 'md5'

const draw = () => {
  let typeSelect = document.getElementById('identiconType')
  switch(typeSelect.options[typeSelect.selectedIndex].value){
    case 'SQUARE':
      document.getElementById('sizeFieldContainer').style.display = 'table-row'
      document.getElementById('segmentFieldContainer').style.display = 'none'
      document.getElementById('symmetryFieldContainer').style.display = 'none'
      drawSquare()
      break
    case 'CIRCULAR':
      document.getElementById('sizeFieldContainer').style.display = 'table-row'
      document.getElementById('segmentFieldContainer').style.display = 'table-row'
      document.getElementById('symmetryFieldContainer').style.display = 'table-row'
      drawCircular()
      break
    case 'POLYGONAL':
      document.getElementById('sizeFieldContainer').style.display = 'table-row'
      document.getElementById('segmentFieldContainer').style.display = 'table-row'
      document.getElementById('symmetryFieldContainer').style.display = 'none'
      drawPolygonal()
      break
  }
}

const drawSquare = () => {
  let options = {
    hash: md5(document.getElementById('textInput').value),
    type: 'SQUARE',
    width: 400,
    size: Number(document.getElementById('sizeField').value) || undefined
  }

  let identiconContainer = document.getElementById('identicon')
  identiconContainer.innerHTML = identicon(options)
}

const drawCircular = () => {
  let options = {
    hash: md5(document.getElementById('textInput').value),
    type: 'CIRCULAR',
    width: 400,
    size: Number(document.getElementById('sizeField').value) || undefined,
    segments: Number(document.getElementById('segmentField').value) || undefined,
    symmetricAxisAngle: Number(document.getElementById('symmetryField').value) || undefined
  }

  let identiconContainer = document.getElementById('identicon')
  identiconContainer.innerHTML = identicon(options)
}

const drawPolygonal = () => {
  let options = {
    hash: md5(document.getElementById('textInput').value),
    type: 'POLYGONAL',
    width: 400,
    size: Number(document.getElementById('sizeField').value) || undefined,
    segments: Number(document.getElementById('segmentField').value) || undefined
  }

  let identiconContainer = document.getElementById('identicon')
  identiconContainer.innerHTML = identicon(options)
}

window.onload = draw
document.getElementById('form').addEventListener('input', draw)
