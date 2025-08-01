import { useState } from 'react'
import './App.css'

function App() {
  const [cocktail, setCocktail] = useState(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search.trim()) return setCocktail(null)

    try {
      const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${search}`)
      const data = await res.json()

      if (!data.drinks) throw new Error('Cóctel no encontrado.')

      setCocktail(data.drinks)
      setError(null)
    } catch (err) {
      setCocktail(null)
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1>Catálogo de Cócteles</h1>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Buscar cóctel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="card-grid">
        {cocktail && cocktail.map((drink) => (
          <div key={drink.idDrink} className="card">
            <img src={drink.strDrinkThumb} alt={drink.strDrink} />
            <h3>{drink.strDrink}</h3>
            <p><strong>Tipo:</strong> {drink.strAlcoholic}</p>
            <p><strong>Categoría:</strong> {drink.strCategory}</p>
            <p><strong>Ingredientes:</strong></p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {Array.from({ length: 15 }, (_, i) => {
                const ingredient = drink[`strIngredient${i + 1}`]
                const measure = drink[`strMeasure${i + 1}`]
                return ingredient ? (
                  <li key={i}>{measure || ''} {ingredient}</li>
                ) : null
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
