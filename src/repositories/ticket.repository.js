import { TicketDAO } from '../dao/ticket.dao.js';

export class TicketRepository {
  constructor() {
    this.dao = new TicketDAO();
  }

  create(ticketData) {
    return this.dao.createTicket(ticketData);
  }

  getById(id) {
    return this.dao.getById(id);
  }
}