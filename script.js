//
// 
// Plz credit me :)
// https://snowfluke.github.io/
//
//

const $ = el => document.querySelector(el)
const _ = er => document.querySelectorAll(er)

const cPicker =  $('.cPicker')
const box = $('.colorPicker')
const colorHex = $('.colored')
const workArea = $('#work')
const icon = $('.item')
const inputBtn = $('.inputBtn')
const resetBtn = $('.resetBtn')
let svgFileName = []

function handleChange(el){
    box.style.background = el.value
    colorHex.innerHTML = el.value.toUpperCase()

    _('path').forEach( er => er.style.fill = el.value)
}

function handleTextChange(el){
    if(el.innerHTML.length != 7) return

    cPicker.value = el.innerHTML
    cPicker.select()
    box.style.background = el.innerHTML
    _('path').forEach( er => er.style.fill = el.innerHTML)
}

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach( e => workArea.addEventListener(e, n => {
        n.preventDefault()
        n.stopPropagation()
    }, false)
)

;['dragenter','dragover'].forEach( e => workArea.addEventListener(e, () => workArea.classList.add('action'), false))

;['dragleave','drop'].forEach( e => workArea.addEventListener(e, () => workArea.classList.remove('action'), false))

workArea.addEventListener('drop', e =>{
    handleFiles(e.dataTransfer.files)
    workArea.style.background = "none"
}, false)



function handleFiles(fileList){
    for(let i = 0; i < fileList.length; i++){

        if(fileList[i].type != "image/svg+xml"){
            alert("SVG Please :'(")
            break
        }
        let reader = new FileReader();
        reader.fileName = fileList[i].name 
        reader.onload = function(e) {
            let svgData = e.target.result;
            svgFileName.push(e.target.fileName)
            workArea.innerHTML += `<div class="item">${svgData}</div>`
        }
        reader.readAsText(fileList[i]);
    }

    return
}

function resetAll(e){
   e.preventDefault()
   
   svgFileName = []
   workArea.innerHTML = ""
   workArea.style.background = 'url(bg.svg) center no-repeat';

}

function exportSVG(){
    if(!svgFileName) return;
    const zip = new JSZip();
    const svgFiles = Array.from(_('.item')).map( el => el.innerHTML)
    
    // One by one download
    // svgFiles.forEach( (el, id) => download(svgFileName[id], el))

    svgFiles.forEach( (el, id) => zip.file(svgFileName[id], el))
    
    // Jszip
    // https://stuk.github.io/jszip/

    zip
        .generateAsync({ type: "base64"})
        .then( content => 
            saveAs('svgBear.zip', `data:application/zip;base64,${content}`)
            // window.location.href = "data:application/zip;base64," + content
        )   
}


// Self-implemented download function by ourcodeworld modified
// https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function saveAs(filename, content) {
    let a = document.createElement('a');
    a.setAttribute('href', content);
    a.setAttribute('download', filename);
  
    a.style.display = 'none';
    document.body.appendChild(a);
  
    a.click();
  
    document.body.removeChild(a);
  }
