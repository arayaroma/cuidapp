import { PrismaClient } from '@prisma/client'
import { mockAvailableRequests, mockMyOffers, mockAcceptedJobs } from '../src/data/mockRequests'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de datos básicos...')

  // Seed de roles básicos
  console.log('📋 Creando roles básicos...')
  const roles = [
    {
      code: 'ADMIN',
      display_name: 'Administrador'
    },
    {
      code: 'SUPERVISOR',
      display_name: 'Supervisor'
    },
    {
      code: 'ASSISTANT',
      display_name: 'Asistente'
    },
    {
      code: 'USER',
      display_name: 'Usuario'
    }
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {},
      create: role,
    })
  }
  console.log('✅ Roles creados')

  // Seed de discapacidades básicas
  console.log('♿ Creando tipos de discapacidad...')
  const disabilities = [
    {
      name: 'Ninguna',
      description: 'Sin discapacidad registrada'
    },
    {
      name: 'Visual',
      description: 'Discapacidad visual total o parcial'
    },
    {
      name: 'Auditiva',
      description: 'Discapacidad auditiva total o parcial'
    },
    {
      name: 'Motora',
      description: 'Discapacidad motora o de movilidad'
    },
    {
      name: 'Cognitiva',
      description: 'Discapacidad cognitiva o intelectual'
    },
    {
      name: 'Múltiple',
      description: 'Múltiples tipos de discapacidad'
    }
  ]

  for (const disability of disabilities) {
    await prisma.disability.upsert({
      where: { name: disability.name },
      update: {},
      create: disability,
    })
  }
  console.log('✅ Tipos de discapacidad creados')

  // Seed de datos mock
  console.log('📝 Creando datos mock de solicitudes...')

  // Crear usuarios únicos
  const userMap = new Map<string, string>() // name to user id
  const uniqueNames = new Set<string>()

  mockAvailableRequests.forEach(r => uniqueNames.add(r.createdBy))
  mockMyOffers.forEach(r => uniqueNames.add(r.clientName))
  mockAcceptedJobs.forEach(r => uniqueNames.add(r.clientName))

  // Crear nombres de asistentes
  const assistantNames = ['Asistente 1', 'Asistente 2', 'Asistente 3']
  assistantNames.forEach(name => uniqueNames.add(name))

  // Obtener roles y discapacidad por defecto
  const userRole = await prisma.role.findUnique({ where: { code: 'USER' } })
  const assistantRole = await prisma.role.findUnique({ where: { code: 'ASSISTANT' } })
  const defaultDisability = await prisma.disability.findUnique({ where: { name: 'Ninguna' } })

  // Crear usuarios
  for (const name of uniqueNames) {
    const isAssistant = assistantNames.includes(name)
    const role = isAssistant ? assistantRole : userRole

    const user = await prisma.user.create({
      data: {
        full_name: name,
        username: name.toLowerCase().replace(/\s+/g, ''),
        email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        password: 'password', // dummy
        role_id: role!.id,
        disability_id: defaultDisability!.id,
      }
    })
    userMap.set(name, user.id)
  }
  console.log(`✅ ${uniqueNames.size} usuarios creados`)

  // Crear ubicaciones para usuarios
  for (const [name, userId] of userMap) {
    const request = mockAvailableRequests.find(r => r.createdBy === name) || mockMyOffers.find(r => r.clientName === name) || mockAcceptedJobs.find(r => r.clientName === name)
    if (request) {
      await prisma.location.create({
        data: {
          user_id: userId,
          label: request.location,
          address_line1: request.location,
          district: request.location,
          province: 'San José',
          country: 'Costa Rica',
        }
      })
    }
  }
  console.log('✅ Ubicaciones creadas')

  // Crear solicitudes disponibles
  const requestMap = new Map<string, string>() // mock id to db id
  for (const req of mockAvailableRequests) {
    const userId = userMap.get(req.createdBy)
    const dbReq = await prisma.userRequests.create({
      data: {
        user_id: userId!,
        title: req.title,
        description: req.description,
        care_type: req.careType,
        person_age: req.personAge,
        requirements: req.requirements,
        urgency: req.urgency,
        hourly_rate: req.hourlyRate,
        total_hours: req.totalHours,
        is_recurring: req.isRecurring,
        request_date: req.startDate,
        request_time: req.schedule,
        status: req.status,
      }
    })
    requestMap.set(req.id, dbReq.id)
  }
  console.log(`✅ ${mockAvailableRequests.length} solicitudes disponibles creadas`)

  // Crear ofertas y trabajos aceptados
  const allOffers = [...mockMyOffers, ...mockAcceptedJobs]
  for (const req of allOffers) {
    const userId = userMap.get(req.clientName)
    const dbReq = await prisma.userRequests.create({
      data: {
        user_id: userId!,
        title: req.title,
        description: req.description,
        care_type: req.careType,
        person_age: req.personAge,
        requirements: req.requirements,
        urgency: req.urgency,
        hourly_rate: req.hourlyRate,
        total_hours: req.totalHours,
        is_recurring: req.isRecurring,
        request_date: req.startDate,
        request_time: req.schedule,
        status: req.status,
      }
    })
    requestMap.set(req.id, dbReq.id)

    // Crear aplicación
    const assistantId = userMap.get(assistantNames[Math.floor(Math.random() * assistantNames.length)])
    let ua = await prisma.usersAssistant.findFirst({
      where: { user_id: userId!, assistant_id: assistantId! }
    })
    if (!ua) {
      ua = await prisma.usersAssistant.create({
        data: {
          user_id: userId!,
          assistant_id: assistantId!,
          start_date: new Date(),
        }
      })
    }

    const status = mockAcceptedJobs.includes(req) ? 'ACCEPTED' : 'PENDING'
    const app = await prisma.userAssistantApplication.create({
      data: {
        user_assistant_id: ua.id,
        description: `Aplicación ${status.toLowerCase()} desde mock`,
        status: status,
      }
    })

    await prisma.applicationRequest.create({
      data: {
        user_assistant_application_id: app.id,
        user_request_id: dbReq.id,
        status: status as any,
      }
    })
  }
  console.log(`✅ ${allOffers.length} ofertas y trabajos aceptados creados`)

  // Crear perfiles de asistentes
  console.log('👤 Creando perfiles de asistentes...')
  
  const assistantProfiles = [
    {
      name: 'María González',
      email: 'maria.gonzalez@example.com',
      phone: '+506 8888-8888',
      bio: 'Cuidadora profesional con más de 8 años de experiencia. Me especializo en el cuidado de adultos mayores y personas con necesidades especiales.',
      specialties: ['elderly', 'disability'],
      yearsExperience: 8,
      certifications: ['Primeros Auxilios', 'Cuidado de Alzheimer', 'RCP'],
      languages: ['Español', 'Inglés'],
      availableWeekdays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
      availabilitySchedule: 'Lunes a Viernes, 8:00 AM - 6:00 PM',
      hourlyRate: 5000,
      isAvailable: true,
      verified: true,
      backgroundCheck: true,
      preferredAgeGroups: ['adultos', 'adultos_mayores'],
      maxDistanceKm: 15,
      hasVehicle: true,
      hasFirstAid: true,
      location: 'San José, Costa Rica',
      rating: 4.8,
      ratingCount: 24,
    },
    {
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@example.com',
      phone: '+506 7777-7777',
      bio: 'Enfermero profesional especializado en cuidados posoperatorios y rehabilitación.',
      specialties: ['hospital', 'companion'],
      yearsExperience: 5,
      certifications: ['Enfermería', 'Fisioterapia Básica'],
      languages: ['Español'],
      availableWeekdays: ['lunes', 'miercoles', 'viernes', 'sabado'],
      availabilitySchedule: 'Horarios flexibles',
      hourlyRate: 7000,
      isAvailable: true,
      verified: true,
      backgroundCheck: true,
      preferredAgeGroups: ['adultos', 'adultos_mayores'],
      maxDistanceKm: 20,
      hasVehicle: false,
      hasFirstAid: true,
      location: 'Heredia, Costa Rica',
      rating: 4.9,
      ratingCount: 18,
    },
    {
      name: 'Ana Martínez',
      email: 'ana.martinez@example.com',
      phone: '+506 6666-6666',
      bio: 'Especialista en cuidado infantil con formación en educación especial.',
      specialties: ['children', 'special-needs'],
      yearsExperience: 3,
      certifications: ['Educación Especial', 'Primeros Auxilios Pediátricos'],
      languages: ['Español', 'Inglés'],
      availableWeekdays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
      availabilitySchedule: 'Lunes a Viernes, 7:00 AM - 3:00 PM',
      hourlyRate: 4500,
      isAvailable: true,
      verified: false,
      backgroundCheck: true,
      preferredAgeGroups: ['ninos', 'adolescentes'],
      maxDistanceKm: 10,
      hasVehicle: true,
      hasFirstAid: true,
      location: 'Alajuela, Costa Rica',
      rating: 5.0,
      ratingCount: 12,
    },
  ]

  for (const profile of assistantProfiles) {
    // Crear usuario para el asistente
    const assistantUser = await prisma.user.create({
      data: {
        full_name: profile.name,
        username: profile.email.split('@')[0],
        email: profile.email,
        password: 'password', // dummy
        role_id: assistantRole!.id,
        disability_id: defaultDisability!.id,
      }
    })

    // Crear perfil de asistente
    await prisma.assistant.create({
      data: {
        user_id: assistantUser.id,
        bio: profile.bio,
        specialties: profile.specialties,
        years_experience: profile.yearsExperience,
        certifications: profile.certifications,
        languages: profile.languages,
        available_weekdays: profile.availableWeekdays,
        availability_schedule: profile.availabilitySchedule,
        hourly_rate: profile.hourlyRate,
        is_available: profile.isAvailable,
        verified: profile.verified,
        background_check: profile.backgroundCheck,
        preferred_age_groups: profile.preferredAgeGroups,
        max_distance_km: profile.maxDistanceKm,
        has_vehicle: profile.hasVehicle,
        has_first_aid: profile.hasFirstAid,
        rating: profile.rating,
        rating_count: profile.ratingCount,
      }
    })

    // Crear ubicación del asistente
    await prisma.location.create({
      data: {
        user_id: assistantUser.id,
        label: profile.location,
        address_line1: profile.location,
        district: profile.location,
        province: profile.location.split(',')[1]?.trim() || 'San José',
        country: 'Costa Rica',
      }
    })
  }
  
  console.log(`✅ ${assistantProfiles.length} perfiles de asistentes creados`)

  console.log('🎉 Seed completado exitosamente!')
  console.log('')
  console.log('📊 Enums disponibles en el sistema:')
  console.log('   • TimeEntryKind: CLOCK_IN, CLOCK_OUT, BREAK_START, BREAK_END, NOTE')
  console.log('   • AbsenceStatus: PENDING, APPROVED, REJECTED, CANCELLED')
  console.log('   • ReportType: ATTENDANCE, ABSENCE, SCHEDULE, PERFORMANCE')
  console.log('')
  console.log('📋 Datos básicos creados:')
  console.log(`   • ${roles.length} roles`)
  console.log(`   • ${disabilities.length} tipos de discapacidad`)
  console.log(`   • ${assistantProfiles.length} perfiles de asistentes`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
