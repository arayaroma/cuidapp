import { PrismaClient } from '@prisma/client'

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
