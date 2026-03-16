import { useEffect, useState } from 'react'
import { categoriesAPI } from '../api/services'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoriesAPI.getAll()
      .then(r => setCategories(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { categories, loading }
}
