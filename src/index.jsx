import {render} from 'react-dom'
import React, {useEffect, useState} from 'react'
import 'regenerator-runtime/runtime'

function useIncrement (initialValue = 0, step = 1) {
    const [count, setCount] = useState(initialValue)
    const increment = () => {
        setCount(c => c + step)
    }
    // ces deux valeurs là sont "exporté"
    return [count, increment]
}

function useAutoIncrement (initialValue = 0, step = 1) {
    const [count, increment] = useIncrement(initialValue, step)
    useEffect(function () {
        const timer = window.setInterval(function () {
            increment()
        }, 1000)

        return function () {
            clearInterval(timer)
        }
    }, [])
    return count
}

function useToggle (initialValue = true) {
    const [value, setValue] = useState(initialValue)
    const toggle = function () {
        setValue(v => !v)
    }
    return [value, toggle]
}

// Fonction qui permet de faire 
// des requete ajax (asynchrone)
function useFetch (url) {
    const [state, setState] = useState({
        items: [],
        loading: true
    })

    useEffect(function () {
        // fonction qui s'auto-appel
        (async function () {
            const response = await fetch(url)
            const responseData = await response.json()
            if (response.ok) {
                setState({
                    items: responseData,
                    loading: false
                })
            } else {
                alert(JSON.stringify(responseData))
                setState(s => ({...s, loading: false}))
            }
        })()
    }, [])

    return [
        state.loading,
        state.items
    ]
}

function Compteur () {
    // const [count, increment] = useIncrement(0,2)
    const count = useAutoIncrement(10)
    return <button > Incrément {count}</button>
}

function App () {
    
    const [compteurVisible, toggleCompteur] = useToggle(true)

    return <div>
        Afficher le compteur
        <input type="checkbox" onChange={toggleCompteur} checked={compteurVisible} />
        <br />
        {compteurVisible && <Compteur />}
        <TodoList />
        <PostTable />
    </div>
}

function PostTable () {
    const [loading, items] = useFetch('https://jsonplaceholder.typicode.com/comments?_limit=20')

    if(loading) {
        return 'Chargement ...'
    }

    return <table>
        <thead>
            <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Contenu</th>
            </tr>
        </thead>
        <tbody>
            {items.map(item => <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.body}</td>
            </tr>)}
        </tbody>
    </table>
}

function TodoList () {
    const [loading, items] = useFetch('https://jsonplaceholder.typicode.com/todos?_limit=20')

    if(loading) {
        return 'Chargement ...'
    }

    return <ul>
        {items.map(t =><li key={t.id}>{t.title}</li>)}
    </ul>
}

render (
    <App />,
    document.getElementById('app')
)