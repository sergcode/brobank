window.addEventListener('DOMContentLoaded', () => {
  const modals = document.querySelectorAll('.modal'),
        modalOpenButtons = document.querySelectorAll(".modal__button-show");

  for (let modalOpen of modals) {
    closeModalBtn(modalOpen.querySelectorAll('.modal__close'));
    keyCloseModal(modalOpen);
    closeModalBg(modalOpen.querySelector('.modal__bg'));
  }

  /** todo Удаление классов и атрибутов у элементов модального окна */
  function setTimeoutCloseModal(parentModal) {
    document.body.classList.remove('overflow-hidden');
    parentModal.classList.add("modal__closure");

    setTimeout(() => {
      parentModal.classList.remove('modal__open');
      parentModal.classList.remove("modal__closure");
    }, 170);
  }

  /** todo Открыть модальное окно  */
  function openModal() {
    for (let modalOpenButton of modalOpenButtons) {
      modalOpenButton.addEventListener('click', function (e) {
        e.preventDefault();

        const modalId = this.getAttribute('data-modal'),
              modalElem = document.querySelector(`.modal[id=${modalId}]`);

        document.body.classList.add('overflow-hidden');
        modalElem.classList.add('modal__opening');

        setTimeout(() => {
          modalElem.classList.add('modal__open');
        }, 5);

        setTimeout(() => {
          modalElem.classList.remove('modal__opening');
        }, 170);
      });
    }
  }

  /** todo Закрыть модальное окно кнопкой */
  function closeModalBtn(closeButtons) {
    for (let closeButton of closeButtons) {
      closeButton.addEventListener('click', function (e) {
        e.preventDefault();
        setTimeoutCloseModal(this.closest('.modal__open'));
      });
    }
  }

  /** todo Закрыть модальное окно кликом по фону */
  function closeModalBg(modalBg) {
    modalBg.addEventListener('click', function(e) {
      e.preventDefault();
      setTimeoutCloseModal(this.closest('.modal__open'));
    });
  }

  /** todo Закрыть модальное окно нажатием на клавишу Escape */
  function keyCloseModal(modalOpen) {
    document.body.addEventListener('keyup', (e) => {
      if (e.key === 'Escape' && modalOpen.classList.contains('modal__open')) {
        setTimeoutCloseModal(modalOpen);
      }
    });
  }

  openModal();
})

