import { Ticket } from '../models/Ticket.js';

export class TicketDAO {
  async createTicket(ticketData) {
    return await Ticket.create(ticketData);
  }
}