/**
 * Generate Employee ID in format: OI[INITIALS][YEAR][SERIAL]
 * 
 * Format breakdown:
 * OI - Odoo India (company code)
 * [INITIALS] - First two letters of first name + last name (e.g., JO for John Oddo)
 * [YEAR] - Year of joining (e.g., 2026)
 * [SERIAL] - Sequential number for that year (e.g., 0001, 0002, etc.)
 * 
 * Example: OIJODO20260001
 * - OI = Odoo India
 * - JO = John Oddo (initials)
 * - 2026 = Year of joining
 * - 0001 = First employee joining in 2026
 */

import prisma from '../config/database.js'

export async function generateEmployeeId(firstName, lastName, yearOfJoining = new Date().getFullYear()) {
  // Validate inputs
  if (!firstName || !lastName) {
    throw new Error('First name and last name are required')
  }

  // Get first letter of first name and first letter of last name
  const firstInitial = firstName.charAt(0).toUpperCase()
  const lastInitial = lastName.charAt(0).toUpperCase()
  const initials = firstInitial + lastInitial

  // Count existing employees for that year
  const startOfYear = new Date(yearOfJoining, 0, 1)
  const endOfYear = new Date(yearOfJoining + 1, 0, 0, 23, 59, 59)

  const count = await prisma.user.count({
    where: {
      createdAt: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
  })

  // Serial number (1-based, formatted as 4 digits)
  const serialNumber = String(count + 1).padStart(4, '0')

  // Generate final Employee ID
  const employeeId = `OI${initials}${yearOfJoining}${serialNumber}`

  // Check if this ID already exists (should not happen but as safety)
  const existing = await prisma.user.findUnique({
    where: { employeeId },
  })

  if (existing) {
    // Fallback: Try next serial number
    const nextSerialNumber = String(count + 2).padStart(4, '0')
    return `OI${initials}${yearOfJoining}${nextSerialNumber}`
  }

  return employeeId
}

/**
 * Parse an employee ID to extract information
 * @param {string} employeeId - The employee ID to parse
 * @returns {Object} Parsed employee ID components
 */
export function parseEmployeeId(employeeId) {
  if (!employeeId || employeeId.length < 12) {
    return null
  }

  try {
    const companyCode = employeeId.substring(0, 2) // OI
    const initials = employeeId.substring(2, 4) // JO
    const year = parseInt(employeeId.substring(4, 8), 10) // 2026
    const serial = employeeId.substring(8) // 0001

    return {
      companyCode,
      initials,
      year,
      serial,
      firstInitial: initials[0],
      lastInitial: initials[1],
    }
  } catch (error) {
    return null
  }
}
