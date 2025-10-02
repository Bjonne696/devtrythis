import { createContext, useContext, useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user || null
      setUser(currentUser)

      if (currentUser) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        if (!error) {
          setProfile(profileData)
        }
      }

      setLoading(false)
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user || null
      setUser(newUser)

      if (newUser) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', newUser.id)
          .single()
          .then(({ data, error }) => {
            if (!error) setProfile(data)
          })
      } else {
        setProfile(null)
      }
    })

    return () => {
      if (listener?.subscription?.unsubscribe) {
        listener.subscription.unsubscribe()
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
