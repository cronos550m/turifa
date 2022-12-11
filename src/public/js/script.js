


 const whatsapp = document.querySelector('.whatsapp')
 const telegram = document.querySelector('.telegram')
 const twitter = document.querySelector('.twitter')
 
 const pageUrl = location.href
 const shareMessage = `Por favor, ingresa a la pagina y elije tu numero`
 
 const whatsappApi = `https://wa.me/?text=${shareMessage} ${pageUrl}`;
 const telegramApi = `https://t.me/share/url?url=${pageUrl}&text=${shareMessage}`;
 const twitterApi = `https://twitter.com/intent/tweet?text=${pageUrl}. ${shareMessage}`;
 
 whatsapp.addEventListener('click', () => {
     console.log('whatsapp button clicked')
     window.open(url = whatsappApi, target ='blank')
 })
 telegram.addEventListener('click', () => {
     console.log('telegram button clicked')
     window.open(url = telegramApi, target ='blank')
 })
 twitter.addEventListener('click', () => {
     console.log('twitter button clicked')
     window.open(url = twitterApi, target ='blank')
 })
