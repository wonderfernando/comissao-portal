import React from 'react';

const Footer: React.FC = () => (
    <footer style={{
        width: '100%',
        padding: '1rem',
        background: '#f5f5f5',
        textAlign: 'right',
        borderTop: '1px solid #e0e0e0',
    }}>
        <span className='font-semibold text-sm text-muted-foreground'>&copy; {new Date().getFullYear()} Poder Local.</span>
    </footer>
);

export default Footer;