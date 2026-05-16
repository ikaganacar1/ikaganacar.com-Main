document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.collapse-toggle').forEach(button => {
    button.addEventListener('click', function () {
      const parentTr = button.closest('tr')
      if (parentTr) {
        parentTr.classList.toggle('collapsed')
      }
    })
  })
})
