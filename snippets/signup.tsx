import React, { useState, useEffect } from "react"
import Example from "https://framer.com/m/framer/Example.js@^1.0.0"

export default function FormSubmission(props) {
    const formUrl = "https://<project_id>.buildship.run/<path>"

    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [formStatus, setFormStatus] = useState("unsubmitted")
    const [emailError, setEmailError] = useState("")
    const [messageError, setMessageError] = useState("")
    const [isEmailFocused, setIsEmailFocused] = useState(false)
    const [isMessageFocused, setIsMessageFocused] = useState(false)
    const [generalError, setGeneralError] = useState("")
    const [shake, setShake] = useState(false)
    const [displayMessage, setDisplayMessage] = useState("")
    const [messageStyle, setMessageStyle] = useState({})

    useEffect(() => {
        const style = document.createElement("style")
        style.type = "text/css"
        style.innerHTML = `
            @keyframes shake {
                0% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                50% { transform: translateX(5px); }
                75% { transform: translateX(-5px); }
                100% { transform: translateX(0); }
            }

            input:focus, textarea:focus {
                border: 1px solid blue !important;
                outline: none;
            }

            input[type="submit"]:hover {
                background-color: #424242;
            }

            input[type="submit"]:active {
                background-color: #303030;
                outline: none;
            }

            input[type="submit"] {
                outline: none;
            }
        `
        document.head.appendChild(style)
    }, [])

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        let isValid = true

        if (!validateEmail(email)) {
            setEmailError("Please provide a valid email")
            isValid = false
        } else {
            setEmailError("")
        }

        if (message.trim() === "") {
            setMessageError("Message is required")
            isValid = false
        } else {
            setMessageError("")
        }

        if (!isValid) {
            setGeneralError("Please fill out all required fields correctly.")
            setShake(true)
            setTimeout(() => setShake(false), 500)
            return
        }

        setGeneralError("")

        try {
            const response = await fetch(formUrl, {
                method: "POST",
                body: JSON.stringify({ email, message }),
                headers: {
                    "Content-type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Network response was not ok")
            }

            setFormStatus("submitted")
            setDisplayMessage("Thank you for contacting us!")
            setMessageStyle(successMessageStyle)
            setTimeout(() => setDisplayMessage(""), 3000)
        } catch (error) {
            console.error("Error during form submission: ", error)
            setFormStatus("error")
            setDisplayMessage("Something went wrong. Please try again!")
            setMessageStyle(errorMessageStyle)
            setTimeout(() => setDisplayMessage(""), 3000)
        }
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handleEmailBlur = () => {
        setIsEmailFocused(false)
        if (!validateEmail(email)) {
            setEmailError("Please provide a valid email")
        } else {
            setEmailError("")
        }
    }

    const handleEmailFocus = () => {
        setIsEmailFocused(true)
    }

    const handleMessageChange = (event) => {
        setMessage(event.target.value)
    }

    const handleMessageBlur = () => {
        setIsMessageFocused(false)
        if (message.trim() === "") {
            setMessageError("Message is required")
        } else {
            setMessageError("")
        }
    }

    const handleMessageFocus = () => {
        setIsMessageFocused(true)
    }

    return (
        <>
            <form
                onSubmit={onSubmit}
                style={{ ...containerStyle, ...(shake ? shakeStyle : {}) }}
            >
                <input
                    type="text"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    onFocus={handleEmailFocus}
                    placeholder="Your email"
                    style={emailError ? errorInputStyle : inputStyle}
                />
                {emailError && <div style={errorTextStyle}>{emailError}</div>}
                <textarea
                    value={message}
                    onChange={handleMessageChange}
                    onBlur={handleMessageBlur}
                    onFocus={handleMessageFocus}
                    placeholder="Your message"
                    style={messageError ? errorTextareaStyle : textareaStyle}
                />
                {generalError && (
                    <div style={generalErrorTextStyle}>{generalError}</div>
                )}
                {displayMessage && (
                    <div style={messageStyle}>{displayMessage}</div>
                )}
                <input type="submit" value="Signup" style={submitButtonStyle} />
            </form>
        </>
    )
}

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "4px",
    gap: "12px",
    width: "100%",
}

const inputStyle = {
    flex: "1",
    fontSize: "16px",
    padding: "0.75rem",
    margin: "0",
    backgroundColor: "transparent",
    border: "1px solid #B3B5BD",
    borderRadius: "12px",
    color: "#000",
    width: "100%",
}

const errorInputStyle = {
    ...inputStyle,
    border: "1px solid red",
}

const textareaStyle = {
    flex: "1",
    fontSize: "16px",
    padding: "0.75rem",
    margin: "0",
    backgroundColor: "transparent",
    border: "1px solid #B3B5BD",
    borderRadius: "12px",
    color: "#000",
    width: "100%",
    height: "100px",
    resize: "none",
}

const errorTextareaStyle = {
    ...textareaStyle,
    border: "1px solid red",
}

const submitButtonStyle = {
    fontSize: "16px",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#52535B",
    color: "#FFF",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
    transition: "background-color 0.3s",
}

const successMessageStyle = {
    textAlign: "center",
    color: "green",
    fontSize: "16px",
    marginTop: "1rem",
}

const errorMessageStyle = {
    textAlign: "center",
    color: "red",
    fontSize: "16px",
    marginTop: "1rem",
}

const generalErrorTextStyle = {
    color: "red",
    fontSize: "14px",
    marginTop: "0.5rem",
    textAlign: "left",
    width: "100%",
}

const errorTextStyle = {
    color: "red",
    fontSize: "14px",
    marginTop: "4px",
    textAlign: "left",
    width: "100%",
}

const shakeStyle = {
    animation: "shake 0.5s",
}
