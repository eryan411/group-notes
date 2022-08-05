const item = document.querySelectorAll('.complete-btn')
const itemCompleted = document.querySelectorAll('.uncomplete-btn')

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    const author = this.parentNode.childNodes[3].innerText
    const date = this.parentNode.childNodes[5].innerText
    console.log(date)
    try{
        const response = await fetch('markcomplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText,
                'author': author,
                'date': date
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    const author = this.parentNode.childNodes[3].innerText
    const date = this.parentNode.childNodes[5].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText,
                'author': author,
                'date': date
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
