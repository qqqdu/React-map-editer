import { saveAs } from 'file-saver'
import { StoreState } from '../types/index'
import { layer } from '../types/layer'
import {block} from '../types/block'
export function saveFile(file: StoreState) {
  const imgSourceHash = {}
  console.log('file is')
  console.log(file)
  file.block.blockList.forEach(item => {
    imgSourceHash[item.name] = item.src
    item.src = ''
  })
  file.layer.layers.forEach(item => {
    item.matrix.forEach(row => {
      row.forEach(col => {
        // 如果有name 和 img url
        if (col.name && col.src) {
          if (!imgSourceHash[col.name]) {
            imgSourceHash[col.name] = col.src
          }
          col.src = ''
        }
      })
    })
  })
  console.log(file)
  const fileString = JSON.stringify({...file, imgSourceHash})
  var blob = new Blob([fileString], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, 'hello world.json')
}
export function importFile(file: string) {
  const fileObj:any = JSON.parse(file)
  console.log(fileObj)
  const imgSourceHash = fileObj.imgSourceHash
  const layer:layer = fileObj.layer
  const block:block = fileObj.block
  layer.layers.forEach(item => {
    item.matrix.forEach(row => {
      row.forEach(col => {
        // 如果有name 和 img url
        if (col.name) {
          if (imgSourceHash[col.name]) {
            col.src = imgSourceHash[col.name]
          }
        }
      })
    })
  })

  block.blockList.forEach(item => {
    if(imgSourceHash[item.name]) {
      item.src = imgSourceHash[item.name]
    }
  })
  return {
    block, layer
  }
}