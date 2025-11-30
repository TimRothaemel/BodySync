console.log("registerPage.js loaded")

import supabase from '../supabaseClient.js'
import { registerUser } from './register.js'
import { createUserData } from './user_data.js'

// Formular-Schritte verwalten
let currentStep = 1
let formData = {}

// Häufigkeits-Labels
const frequencyLabels = {
    1: 'Wöchentlich',
    2: 'Täglich', 
    3: 'Mehrmals täglich'
}

function showStep(stepNumber) {
    const cardContainer = document.getElementById('card-container')
    
    // Entferne alle Flip-Klassen
    const allFlipClasses = [
        'flip-to-step2', 'flip-to-step3', 'flip-to-step4', 'flip-to-success',
        'flip-to-step1-back', 'flip-to-step2-back', 'flip-to-step3-back'
    ]
    cardContainer.classList.remove(...allFlipClasses)
    
    // Bestimme die richtige Flip-Klasse
    if (stepNumber > currentStep) {
        cardContainer.classList.add(`flip-to-step${stepNumber}`)
    } else if (stepNumber < currentStep) {
        cardContainer.classList.add(`flip-to-step${stepNumber}-back`)
    }
    
    currentStep = stepNumber
    
    // Step visibility nach Animation aktualisieren
    setTimeout(() => {
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active')
        })
        
        const stepElement = document.getElementById(`register-form-step${stepNumber}`)
        if (stepElement) {
            stepElement.classList.add('active')
        }
        
        // Zusammenfassung aktualisieren für Schritt 4
        if (stepNumber === 4) {
            updateSummary()
        }
    }, 400)
}

function updateSummary() {
    // Fülle die Zusammenfassung
    document.getElementById('summary-name').textContent = formData.fullName
    document.getElementById('summary-height').textContent = formData.height
    document.getElementById('summary-start-weight').textContent = formData.startWeight
    document.getElementById('summary-target-weight').textContent = formData.targetWeight
    document.getElementById('summary-frequency').textContent = frequencyLabels[formData.dataFrequency]
    
    // Benachrichtigungen zusammenfassen
    const notifications = []
    if (formData.pushNotifications) notifications.push('Push')
    if (formData.emailNotifications) notifications.push('E-Mail')
    document.getElementById('summary-notifications').textContent = 
        notifications.length > 0 ? notifications.join(', ') : 'Keine'
}

function showSuccessStep() {
    const cardContainer = document.getElementById('card-container')
    const loadingOverlay = document.getElementById('loading-overlay')
    
    // Loading Overlay ausblenden
    loadingOverlay.classList.remove('active')
    
    // Erfolgs-Animation starten
    cardContainer.classList.add('flip-to-success')
    
    // Erfolgs-Schritt anzeigen
    setTimeout(() => {
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active')
        })
        document.getElementById('register-form-step5').classList.add('active')
    }, 400)
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

    // Schritt 2: Körperdaten
    const step2Form = document.getElementById('register-form-step2')
    if (step2Form) {
        step2Form.addEventListener('submit', async function(e) {
            e.preventDefault()
            
            // Daten aus Schritt 2 sammeln
            formData = {
                ...formData,
                height: document.getElementById('height-now').value,
                startWeight: document.getElementById('start-weight').value,
                targetWeight: document.getElementById('target-weight').value
            }
            
            // Zu Schritt 3 wechseln
            showStep(3)
        })
    }

    // Schritt 3: Einstellungen
    const step3Form = document.getElementById('register-form-step3')
    if (step3Form) {
        step3Form.addEventListener('submit', async function(e) {
            e.preventDefault()
            
            // Daten aus Schritt 3 sammeln
            formData = {
                ...formData,
                dataFrequency: parseInt(document.getElementById('data-frequency').value),
                pushNotifications: document.getElementById('push-notifications').checked,
                emailNotifications: document.getElementById('email-notifications').checked
            }
            
            // Zu Schritt 4 (Zusammenfassung) wechseln
            showStep(4)
        })
    }

    // Schritt 4: Zusammenfassung und Registrierung abschließen
    const step4Form = document.getElementById('register-form-step4')
    if (step4Form) {
        step4Form.addEventListener('submit', async function(e) {
            e.preventDefault()
            
            // Loading Overlay anzeigen
            const loadingOverlay = document.getElementById('loading-overlay')
            loadingOverlay.classList.add('active')
            
            // Button deaktivieren während der Verarbeitung
            const submitButton = step4Form.querySelector('button[type="submit"]')
            const originalButtonText = submitButton.textContent
            submitButton.textContent = 'Wird verarbeitet...'
            submitButton.disabled = true
            
            try {
                console.log('Starte Registrierungsprozess...')
                
                // 1. Benutzer registrieren
                const authResult = await registerUser(
                    formData.email,
                    formData.password,
                    formData.fullName,
                    formData.dayOfBirth
                )
                
                if (!authResult.success) {
                    throw new Error('Registrierung fehlgeschlagen: ' + authResult.error)
                }
                
                console.log('Auth erfolgreich:', authResult.user.id)
                
                // 2. Basis-Profil in 'profiles' Tabelle erstellen
                const profileResult = await createUserProfile(
                    authResult.user.id,
                    formData.email,
                    formData.fullName,
                    formData.dayOfBirth
                )
                
                if (!profileResult.success) {
                    throw new Error('Profil konnte nicht erstellt werden: ' + profileResult.error)
                }
                
                console.log('Profil erstellt:', profileResult.profile)
                
                // 3. Zusätzliche Daten in 'user_data' Tabelle speichern
                const userDataResult = await createUserData(
                    authResult.user.id,
                    formData.height,
                    formData.startWeight,
                    formData.targetWeight
                )
                
                if (!userDataResult.success) {
                    throw new Error('User Data konnte nicht erstellt werden: ' + userDataResult.error)
                }
                
                console.log('User Data erstellt:', userDataResult.userData)
                
                // 4. Einstellungen in 'user_settings' Tabelle speichern
                const settingsResult = await createUserSettings(
                    authResult.user.id,
                    formData.dataFrequency,
                    formData.pushNotifications,
                    formData.emailNotifications
                )
                
                if (!settingsResult.success) {
                    throw new Error('Einstellungen konnten nicht gespeichert werden: ' + settingsResult.error)
                }
                
                console.log('Einstellungen gespeichert:', settingsResult.settings)
                console.log('Registrierung vollständig abgeschlossen!')
                
                // Kurze Verzögerung für bessere UX
                setTimeout(() => {
                    showSuccessStep()
                    
                    // Nach 3 Sekunden weiterleiten
                    setTimeout(() => {
                        window.location.href = '/src/pages/dashboard.html'
                    }, 3000)
                }, 1000)
                
            } catch (error) {
                console.error('Fehler bei der Registrierung:', error)
                
                // Button zurücksetzen
                submitButton.textContent = originalButtonText
                submitButton.disabled = false
                
                loadingOverlay.classList.remove('active')
                
                // Benutzerfreundliche Fehlermeldung anzeigen
                showError('Registrierung fehlgeschlagen: ' + error.message)
            }
        })
    }

    // Zurück-Buttons
    document.getElementById('back-button-step2')?.addEventListener('click', () => showStep(1))
    document.getElementById('back-button-step3')?.addEventListener('click', () => showStep(2))
    document.getElementById('back-button-step4')?.addEventListener('click', () => showStep(3))

    // Slider Live-Update
    const frequencySlider = document.getElementById('data-frequency')
    if (frequencySlider) {
        frequencySlider.addEventListener('input', function() {
            // Optional: Live-Feedback für Slider Wert
            console.log('Frequency:', frequencyLabels[this.value])
        })
    }
}

// Fehleranzeige Funktion
function showError(message) {
    // Erstelle oder finde Error-Container
    let errorContainer = document.getElementById('error-message')
    if (!errorContainer) {
        errorContainer = document.createElement('div')
        errorContainer.id = 'error-message'
        errorContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 90%;
            text-align: center;
        `
        document.body.appendChild(errorContainer)
    }
    
    errorContainer.textContent = message
    errorContainer.style.display = 'block'
    
    // Auto-hide nach 5 Sekunden
    setTimeout(() => {
        errorContainer.style.display = 'none'
    }, 5000)
}

// createUserProfile Funktion
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

        if (profileError) {
            console.error('Profile Error Details:', profileError)
            throw profileError
        }

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

// createUserSettings Funktion
async function createUserSettings(userId, dataFrequency, pushNotifications, emailNotifications) {
    try {
        const { data: settingsData, error: settingsError } = await supabase
            .from('user_settings')
            .insert([
                {
                    user_id: userId,
                    data_frequency: dataFrequency,
                    push_notifications: pushNotifications,
                    email_notifications: emailNotifications,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ])
            .select()

        if (settingsError) {
            console.error('Settings Error Details:', settingsError)
            throw settingsError
        }

        console.log('User settings created successfully:', settingsData)
        return {
            success: true,
            settings: settingsData
        }
        
    } catch (error) {
        console.error('User settings creation failed:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing registration form...')
    initializeEventListeners()
    showStep(1)
})