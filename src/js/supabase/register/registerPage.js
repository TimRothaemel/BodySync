console.log("Register page script loaded")

import { completeRegistration } from './register.js'

const registerForm = document.getElementById('register-form')

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  try {
    const newUserEmail = document.getElementById('email').value
    const newUserPassword = document.getElementById('password').value
    const newUserFullName = document.getElementById('full-name').value
    const newUserDayOfBirth = document.getElementById('day-of-birth').value

    // Korrekte Funktion aufrufen
    await completeRegistration(newUserEmail, newUserPassword, newUserFullName, newUserDayOfBirth)
    
    console.log('Registration process completed successfully!')
    alert('Registrierung erfolgreich! Bitte überprüfe deine E-Mails zur Verifikation.')
    
    registerForm.reset()
    
    // Optional: Weiterleitung zur Login-Seite
    // setTimeout(() => { window.location.href = '/login.html' }, 3000)
    
  } catch (error) {
    console.error('Registration failed:', error)
    alert('Registrierung fehlgeschlagen: ' + error.message)
  }
})