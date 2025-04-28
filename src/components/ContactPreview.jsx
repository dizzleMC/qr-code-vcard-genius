
import React from 'react';
import { Button } from "@/components/ui/button";

export const ContactPreview = ({ contacts, selectedContact, onSelectContact }) => {
  return (
    <div className="mt-4 bg-white rounded-xl shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-3">Importierte Daten</h3>
      <p className="text-gray-600 mb-3">
        {contacts.length} Kontakte wurden importiert.
      </p>
      <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Vorschau</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Email</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr 
                key={index} 
                className={`border-t border-gray-200 hover:bg-gray-50 cursor-pointer ${
                  selectedContact === contact ? 'bg-orange-50' : ''
                }`}
                onClick={() => onSelectContact(contact)}
              >
                <td className="px-4 py-2">
                  <Button 
                    size="sm"
                    variant={selectedContact === contact ? "default" : "outline"}
                    className={selectedContact === contact ? "bg-[#ff7e0c]" : ""}
                  >
                    Vorschau
                  </Button>
                </td>
                <td className="px-4 py-2">
                  {contact.firstName} {contact.lastName}
                </td>
                <td className="px-4 py-2">{contact.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
