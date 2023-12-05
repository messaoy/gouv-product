import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ServiceDetails() {
  const location = useLocation();
  return (<div>
        Statut du produit: {location.state.status}
        <Markdown remarkPlugins={[remarkGfm]}>{location.state.content}</Markdown>
    </div>);
}
