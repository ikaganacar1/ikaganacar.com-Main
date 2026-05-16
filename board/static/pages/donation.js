function copyToClipboard (elementId) {
  const textToCopy = document.getElementById(elementId).innerText
  const status = document.querySelector('.copy-status')
  const showStatus = message => {
    if (status) {
      status.innerText = message
    }
  }

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        showStatus('Copied to clipboard')
      })
      .catch(err => {
        console.error('Could not copy text: ', err)
        showStatus('Could not copy automatically')
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
  showStatus('Copied to clipboard')
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-copy-target]').forEach(button => {
    button.addEventListener('click', function () {
      copyToClipboard(button.dataset.copyTarget)
    })
  })
})
