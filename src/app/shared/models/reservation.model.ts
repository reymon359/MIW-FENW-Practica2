export class Reservation {
  constructor(
    public rsvId: number, // example: 925
    public courtId: number, // example: 4
    public rsvdateTime: number, // example: 1544529600000, javascript getTime()
    public rsvday: string, // example: 11/12/2018, rsvdateTime in format dd/mm/YYYY
    public rsvtime: string, // example: 13:00, rsvdateTime in format hh:00
  ) {
  }
}
