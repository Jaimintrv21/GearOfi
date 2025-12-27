from odoo import models, fields, api, exceptions, _

class MaintenanceRequest(models.Model):
    _name = 'gear.maintenance.request'
    _description = 'Maintenance Request'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='Subject', required=True)
    equipment_id = fields.Many2one('gear.equipment', string='Equipment', required=True)
    maintenance_team_id = fields.Many2one('gear.maintenance.team', string='Team', required=True)
    technician_id = fields.Many2one('res.users', string='Technician')
    
    request_type = fields.Selection([
        ('corrective', 'Corrective'),
        ('preventive', 'Preventive')
    ], string='Request Type', default='corrective', required=True)
    
    scheduled_date = fields.Datetime(string='Scheduled Date')
    duration = fields.Float(string='Duration (Hours)')
    
    state = fields.Selection([
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('repaired', 'Repaired'),
        ('scrap', 'Scrap')
    ], string='Status', default='new', tracking=True)

    # ---------------------------------------------------------
    # Business Logic: Auto-fill
    # ---------------------------------------------------------
    @api.onchange('equipment_id')
    def _onchange_equipment_id(self):
        if self.equipment_id:
            if self.equipment_id.maintenance_team_id:
                self.maintenance_team_id = self.equipment_id.maintenance_team_id
            if self.equipment_id.technician_id:
                self.technician_id = self.equipment_id.technician_id

    # ---------------------------------------------------------
    # Business Logic: Validation
    # ---------------------------------------------------------
    @api.constrains('technician_id', 'maintenance_team_id')
    def _check_technician_team(self):
        for request in self:
            if request.technician_id and request.maintenance_team_id:
                if request.technician_id not in request.maintenance_team_id.member_ids:
                    raise exceptions.ValidationError(_("The assigned technician must be a member of the selected Maintenance Team."))

    @api.constrains('request_type', 'scheduled_date')
    def _check_preventive_schedule(self):
        for request in self:
            if request.request_type == 'preventive' and not request.scheduled_date:
                raise exceptions.ValidationError(_("Preventive maintenance requests must have a Scheduled Date."))

    # ---------------------------------------------------------
    # Business Logic: Workflow Actions
    # ---------------------------------------------------------
    def action_in_progress(self):
        self.write({'state': 'in_progress'})

    def action_repaired(self):
        self.write({'state': 'repaired'})

    def action_scrap(self):
        self.write({'state': 'scrap'})
        # Auto-scrap equipment
        if self.equipment_id:
            self.equipment_id.write({'is_scrapped': True})
            self.equipment_id.message_post(body=_("Equipment scrapped via Maintenance Request: %s") % self.name)
