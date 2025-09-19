import { TicketDAO } from '../dao/ticket.dao.js';

export class TicketRepository {
  constructor() {
    this.dao = new TicketDAO();
  }

  createTicket(ticketData) {
    return this.dao.createTicket(ticketData);
  }
}