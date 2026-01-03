/**
 * Utility functions for Employee ID handling
 */

/**
 * Generate preview of Employee ID from first name, last name, and year
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {number} year - Year of joining
 * @returns {string} Formatted employee ID preview
 */
export function previewEmployeeId(firstName, lastName, year) {
  if (!firstName || !lastName) return 'OI____YYYY0001'

  const firstInitial = firstName.charAt(0).toUpperCase()
  const lastInitial = lastName.charAt(0).toUpperCase()
  const initials = firstInitial + lastInitial

  return `OI${initials}${year}0001`
}

/**
 * Parse an employee ID to extract information
 * @param {string} employeeId - The employee ID to parse
 * @returns {Object|null} Parsed employee ID components
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

/**
 * Get description of employee ID format
 * @returns {string} Description of the format
 */
export function getEmployeeIdFormatDescription() {
  return `OI[INITIALS][YEAR][SERIAL]
  • OI: Odoo India (Company Code)
  • INITIALS: First letters of first and last name
  • YEAR: Year of joining
  • SERIAL: Sequential number for that year`
}
