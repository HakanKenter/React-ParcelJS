import {render} from 'react-dom'
import React, {useEffect, useState} from 'react'
import './index.css'

// Je crée une fonction qui renvoi simplement
// le state d'une constante et une fonction d'incrmentation
function useIncrement (initial, step) {
    const [count, setCount] = useState(initial)
    const increment = () => {
        setCount(c => c + step)
    }
    return [count, increment]
}

function Compteur () {
    // Et ici je dis que count et increment
    // sont de type useIncrement
    // Comprendre cette maniere d'écrire le code 
    const [count, increment] = useIncrement(0,2)

    useEffect(() => {
        const timer = window.setInterval(() => {
            increment()
        }, 1000)

        return function () {
            console.log('tes')
            clearInterval(timer)
        }
    }, [])

    useEffect(() => {
        document.title = "Compteur " + count
    }, [count])

    return <button onClick={increment}> Incrément {count}</button>
}

render (
    <div>
        <Compteur />
    </div>,
    document.getElementById('app')
)