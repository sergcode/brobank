window.addEventListener('DOMContentLoaded', () => {
  const readMore = {
    parent: document.querySelectorAll('.readMore'),
    arrow:
      `<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.70393 0.292893C8.09869 0.683417 8.09869 1.31658 7.70393 1.70711L2.44038 7L7.70393 12.2929C8.09869 12.6834 8.09869 13.3166 7.70393 13.7071C7.30917 14.0976 6.66915 14.0976 6.27439 13.7071L0.296068 7.70711C-0.0986893 7.31658 -0.0986893 6.68342 0.296068 6.29289L6.27439 0.292893C6.66915 -0.0976311 7.30917 -0.0976311 7.70393 0.292893Z" fill="#B8BDC2"/>
      </svg>
      `,
    unwrap: (text) => { return text }
  }

  function createButton() {
    const createButtonReadMore = document.createElement('button');
    createButtonReadMore.classList.add('readMore__button-read-more');
    createButtonReadMore.setAttribute('role', 'button');
    createButtonReadMore.innerHTML = `<span>${readMore.unwrap('Развернуть')}</span>&nbsp;${readMore.arrow}`;
    return createButtonReadMore;
  }

  /** todo Показать или скрыть блок **/
  function readMoreShowHideBlock(elem, buttonReadMore) {
    const increaseMaxHeight = () => elem.style.maxHeight = `${elem.scrollHeight}px`,
          reduceMaxHeight = () => elem.style.maxHeight = null;

    if (elem.parentElement.closest('.readMore.show')) {
      elem.parentElement.classList.add('fade');
      reduceMaxHeight();
      buttonReadMore.innerText = readMore.unwrap('Развернуть');

      setTimeout(() => {
        elem.parentElement.classList.remove('show');
        elem.parentElement.classList.remove('fade');
      }, 300);

    } else {
      elem.parentElement.classList.add('show');
      buttonReadMore.innerText = readMore.unwrap('Свернуть')
      increaseMaxHeight();
    }
  }

  for (let readMoreParent of readMore.parent) {
    readMoreParent.append(createButton());

    const childHideBlock = readMoreParent.querySelector('.readMore__hidden-text'),
          buttonReadMore = readMoreParent.querySelector('.readMore__button-read-more');

    buttonReadMore.addEventListener('click', function(e) {
      e.preventDefault();

      readMoreShowHideBlock(childHideBlock, this.querySelector('span'))
    })
  }
})
