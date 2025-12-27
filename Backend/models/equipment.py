from odoo import models, fields, api

class Equipment(models.Model):
    _name = 'gear.equipment'
    _description = 'Maintenance Equipment'

    name = fields.Char(string='Equipment Name', required=True)
    serial_number = fields.Char(string='Serial Number')
    purchase_date = fields.Date(string='Purchase Date')
    warranty_end_date = fields.Date(string='Warranty Expiry')
    location = fields.Char(string='Location')
    
    department_id = fields.Many2one('hr.department', string='Department')
    employee_id = fields.Many2one('res.users', string='Employee/Custodian')
    
    maintenance_team_id = fields.Many2one('gear.maintenance.team', string='Maintenance Team')
    technician_id = fields.Many2one('res.users', string='Default Technician')
    
    is_scrapped = fields.Boolean(string='Scrapped', default=False, readonly=True)
    
    maintenance_count = fields.Integer(compute='_compute_maintenance_count', string='Maintenance Count')

    @api.depends('name') # Dummy depend to ensure computation triggers if needed, though usually depends on relation
    def _compute_maintenance_count(self):
        for equipment in self:
            equipment.maintenance_count = self.env['gear.maintenance.request'].search_count([
                ('equipment_id', '=', equipment.id)
            ])
