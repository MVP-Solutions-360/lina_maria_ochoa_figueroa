import type { RouteObject } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import BmqPage from '../pages/BmqPage'
import HealthcareConsultingPage from '../pages/HealthcareConsultingPage'
import HomePage from '../pages/HomePage'
import MedicalLawPage from '../pages/MedicalLawPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProfessionalProfilePage from '../pages/ProfessionalProfilePage'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/perfil-profesional', element: <ProfessionalProfilePage /> },
      { path: '/derecho-medico', element: <MedicalLawPage /> },
      { path: '/consultoria-en-salud', element: <HealthcareConsultingPage /> },
      { path: '/blindaje-medico-quirurgico', element: <BmqPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
