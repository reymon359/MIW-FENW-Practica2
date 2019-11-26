export class Reservation {
  constructor(
    private rsvId: number, // example: 925
    private courtId: number, // example: 4
    private rsvdateTime: number, // example: 1544529600000, javascript getTime()
    private rsvday: string, // example: 11/12/2018, rsvdateTime in format dd/mm/YYYY
    private rsvtime: string, // example: 13:00, rsvdateTime in format hh:00
  ) {
  }
}
