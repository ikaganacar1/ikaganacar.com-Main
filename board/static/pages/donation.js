function copyToClipboard (elementId) {
  const textToCopy = document.getElementById(elementId).innerText
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert('Copied to clipboard: ' + textToCopy)
      })
      .catch(err => {
        console.error('Could not copy text: ', err)
      })
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = textToCopy
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  alert('Copied to clipboard: ' + textToCopy)
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-copy-target]').forEach(button => {
    button.addEventListener('click', function () {
      copyToClipboard(button.dataset.copyTarget)
    })
  })
})
