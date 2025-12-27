{
    'name': 'GearGuard - Maintenance Management',
    'version': '1.0',
    'category': 'Operations/Maintenance',
    'summary': 'Equipment and Maintenance Management System',
    'description': """
    GearGuard Backend Module
    ========================
    - Equipment Management
    - Maintenance Teams
    - Maintenance Requests (Corrective & Preventive)
    
    Designed for Hackathon usage.
    """,
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
