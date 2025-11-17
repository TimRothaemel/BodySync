console.log("registerPage.js loaded")

import supabase from '../supabaseClient.js'
import { registerUser } from './register.js'
import { createUserData } from './user_data.js'

// Formular-Schritte verwalten
let currentStep = 1
let formData = {}

function showStep(stepNumber) {
  // Alle Schritte ausblenden
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active')
  })
  
  // Gewünschten Schritt anzeigen
  const stepElement = document.getElementById(`register-form-step${stepNumber}`)
  if (stepElement) {
    stepElement.classList.add('active')
  }
  currentStep = stepNumber
}

function initializeEventListeners() {
  // Schritt 1: Grunddaten
  const step1Form = document.getElementById('register-form-step1')
  if (step1Form) {
    step1Form.addEventListener('submit', async function(e) {
      e.preventDefault()
      
      // Daten aus Schritt 1 sammeln
      formData = {
        fullName: document.getElementById('full-name').value,
        dayOfBirth: document.getElementById('day-of-birth').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      }
      
      // Zu Schritt 2 wechseln
      showStep(2)
    })
  }

  // Zurück-Button
  const backButton = document.getElementById('back-button')
  if (backButton) {
    backButton.addEventListener('click', function() {
      showStep(1)
    })
  }

  // Schritt 2: Körperdaten und Registrierung abschließen
  const step2Form = document.getElementById('register-form-step2')
  if (step2Form) {
    step2Form.addEventListener('submit', async function(e) {
      e.preventDefault()
      
      // Daten aus Schritt 2 sammeln
      const additionalData = {
        height: document.getElementById('height-now').value,
        startWeight: document.getElementById('start-weight').value,
        targetWeight: document.getElementById('target-weight').value
      }
      
      // Alle Daten kombinieren
      const completeData = { ...formData, ...additionalData }
      
      try {
        // Benutzer registrieren
        const authResult = await registerUser(
          completeData.email,
          completeData.password,
          completeData.fullName,
          completeData.dayOfBirth
        )
        
        if (authResult.success) {
          // 1. Basis-Profil in 'profiles' Tabelle erstellen
          const profileResult = await createUserProfile(
            authResult.user.id,
            completeData.email,
            completeData.fullName,
            completeData.dayOfBirth
          )
          
          if (profileResult.success) {
            // 2. Zusätzliche Daten in 'user_data' Tabelle speichern
            const userDataResult = await createUserData(
              authResult.user.id,
              completeData.height,
              completeData.startWeight,
              completeData.targetWeight
            )
            
            if (userDataResult.success) {
              console.log('Registrierung vollständig abgeschlossen!')
              console.log('Profil:', profileResult.profile)
              console.log('User Data:', userDataResult.userData)
              
              // Weiterleitung oder Erfolgsmeldung
              window.location.href = '/src/pages/dashboard.html'
            } else {
              throw new Error('User Data konnte nicht erstellt werden: ' + userDataResult.error)
            }
          } else {
            throw new Error('Profil konnte nicht erstellt werden: ' + profileResult.error)
          }
        } else {
          throw new Error('Registrierung fehlgeschlagen: ' + authResult.error)
        }
      } catch (error) {
        console.error('Fehler bei der Registrierung:', error)
        alert('Registrierung fehlgeschlagen: ' + error.message)
      }
    })
  }
}

// Vereinfachte createUserProfile Funktion (nur Basis-Daten)
async function createUserProfile(userId, email, fullName, dayOfBirth) {
  try {
    const formattedDate = dayOfBirth ? new Date(dayOfBirth).toISOString().split('T')[0] : null
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: userId,
          email: email,
          role: 'user',
          full_name: fullName,
          day_of_birth: formattedDate,
          subscription_plan: 'free'
        }
      ])
      .select()

    if (profileError) throw profileError

    console.log('Profile created successfully:', profileData)
    return {
      success: true,
      profile: profileData
    }
    
  } catch (error) {
    console.error('Profile creation failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Warte bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing registration form...')
  initializeEventListeners()
  showStep(1)
})