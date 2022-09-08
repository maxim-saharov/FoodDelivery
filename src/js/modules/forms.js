//
import {closeModal, openModal} from './modal'
import {postData} from '../services/services'
import spinner from '../../img/form/spinner.svg'


function forms(formsSelector, modalTimerId) {
   const forms = document.querySelectorAll( formsSelector )

   const message = {
      loading: spinner,
      success: 'Спасибо! Скоро мы с вами свяжемся',
      failure: 'Упс, что-то пошло не так...'
   }

   forms.forEach( item => {
      bindPostData( item )
   } )

   function bindPostData(form) {

      form.addEventListener( 'submit', async (e) => {


         e.preventDefault()

         let statusMessage = document.createElement( 'img' )
         statusMessage.src = message.loading
         statusMessage.style.cssText = 'display: block; margin: 0 auto;'
         form.insertAdjacentElement( 'afterend', statusMessage )

         const formData = new FormData( form )

         const json = JSON.stringify( Object.fromEntries( formData.entries() ) )


         try {

            let data = await postData( 'http://localhost:3000/requests', json )
            console.log( 'запостили: ', data )
            console.log( 'смотри все данные по: ' + 'http://localhost:3000/requests' )
            showThanksModal( message.success )
            statusMessage.remove()
            form.reset()
            statusMessage.remove()

         } catch (error) {

            console.log( 'Ошибка: ' + error )

            alert( 'Ошибка: ' + error + '\n' +
               'Наверно JSON Server отключен, \n' +
               'тогда мы сделаем отправку данных на https://jsonplaceholder.typicode.com/posts \n' +
               'смотри в консоле ответы'
            )

            try {
               let data2 = await postData( 'https://jsonplaceholder.typicode.com/posts', json )
               console.log( 'запостили: ', data2 )
               showThanksModal( message.success )
               form.reset()
               statusMessage.remove()
            } catch (error2) {
               console.log( 'Ошибка: ' + error2 )
               showThanksModal( message.failure )
               form.reset()
               statusMessage.remove()
            }

         }

      } )

   }

   function showThanksModal(message) {


      const prevModalDialog = document.querySelector( '.modal__dialog' )

      prevModalDialog.classList.add( 'hide' )

      openModal( '.modal', modalTimerId )

      const thanksModal = document.createElement( 'div' )
      thanksModal.classList.add( 'modal__dialog' )
      thanksModal.innerHTML = `
            <div class='modal__content'>
                <div class='modal__close' data-close>×</div>
                <div class='modal__title'>${message}</div>
            </div>
        `


      setTimeout( () => {
         document.querySelector( '.modal' ).append( thanksModal )
      }, 200 )


      setTimeout( () => {
         thanksModal.remove()
         prevModalDialog.classList.add( 'show' )
         prevModalDialog.classList.remove( 'hide' )
         closeModal( '.modal' )
      }, 4000 )
   }
}

export default forms
