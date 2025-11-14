/**
 * Script de prueba para verificar las funciones de usuario con discapacidades múltiples
 * Este es un archivo temporal para debugging
 */

import { getUserWithRelations, updateUserDisabilities, formatUserProfile } from "@/lib/prismaHelpers";

async function testUserDisabilities() {
  try {
    console.log("🔍 Probando funciones de usuario con discapacidades...\n");

    // Nota: Reemplaza este ID con un ID de usuario real de tu base de datos
    const testUserId = "TEST_USER_ID";

    console.log("1. Obteniendo usuario con relaciones...");
    const user = await getUserWithRelations(testUserId);
    
    if (!user) {
      console.log("❌ Usuario no encontrado");
      return;
    }

    console.log("✅ Usuario encontrado:");
    console.log(`   - Nombre: ${user.full_name}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Rol: ${user.role?.display_name || "Sin rol"}`);
    
    if (user.user_disabilities && user.user_disabilities.length > 0) {
      console.log(`   - Discapacidades (${user.user_disabilities.length}):`);
      user.user_disabilities.forEach(ud => {
        console.log(`     * ${ud.disability.name}`);
      });
    } else {
      console.log("   - No tiene discapacidades registradas");
    }

    console.log("\n2. Formateando perfil para API...");
    const formatted = formatUserProfile(user);
    console.log("✅ Perfil formateado:");
    console.log(`   - Nombre: ${formatted.fullName}`);
    console.log(`   - Discapacidades: ${formatted.disabilities.length} registradas`);

    console.log("\n✨ Todas las pruebas pasaron correctamente!");
  } catch (error) {
    console.error("❌ Error en las pruebas:", error);
    if (error instanceof Error) {
      console.error("   Mensaje:", error.message);
      console.error("   Stack:", error.stack);
    }
  }
}

// Para ejecutar este test:
// 1. Asegúrate de tener un usuario en la base de datos
// 2. Reemplaza TEST_USER_ID con un ID real
// 3. Ejecuta: tsx test-user-disabilities.ts

// Descomentar para ejecutar:
// testUserDisabilities();

export { testUserDisabilities };
