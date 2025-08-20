import os
import requests
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

print(os.getenv('POSTGRESQL_DATABASE_URL'))
engine = create_engine(os.getenv('POSTGRESQL_DATABASE_URL'))
metadata = MetaData()
cartas_table = Table(
    'cartas',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('nombre', String, nullable=False),
    Column('tipo', String, nullable=False),
    Column('subtipo1', String),
    Column('subtipo2', String),
    Column('subtipo3', String),
    Column('subtipo4', String),
    Column('supertipo', String),
    Column('rareza', String, nullable=False),
    Column('coste', Integer, nullable=False),
    Column('expansion', String, nullable=False),
    Column('imagen', String, nullable=False),
    Column('text', Text, nullable=False),
    Column('costeBoveda', Integer),
    Column('prohibida', Boolean, default=False),
    Column('createdAt', DateTime, default=datetime.utcnow),
    Column('updatedAt', DateTime, default=datetime.utcnow),
    Column('idLairen', Integer, primary_key=True, nullable=False),
)

metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

response = requests.get(os.getenv('LAIREN_API_URL'))
data = response.json()

for carta in data:
    nueva_carta = {
        'nombre': carta['nombreCarta'],
        'tipo': carta['tipo']['nombreTipo'],
        'subtipo1': carta['subtipo']['nombreSubTipo'] if carta.get('subtipo') and carta['subtipo'].get('nombreSubTipo') else None,
        'subtipo2': carta['subtipo2']['nombreSubTipo'] if carta.get('subtipo2') and carta['subtipo2'].get('nombreSubTipo') else None,
        'subtipo3': carta['subtipo3']['nombreSubTipo'] if carta.get('subtipo3') and carta['subtipo3'].get('nombreSubTipo') else None,
        'subtipo4': carta['subtipo4']['nombreSubTipo'] if carta.get('subtipo4') and carta['subtipo4'].get('nombreSubTipo') else None,
        'supertipo': carta['subtipo3']['nombreSubTipo'] if carta.get('subtipo3') and carta['subtipo3'].get('nombreSubTipo') == 'REALEZA' else None,
        'rareza':    carta['rareza']['nombreRareza'],
        'coste': carta['costeCarta'],
        'expansion': carta['expansion']['nombreExpansion'],
        'imagen': carta['urlImagen'],
        'text': carta['textoCarta'],
        'costeBoveda': carta.get('numeroTesoro'),
        'prohibida': carta.get('baneada'),
        'createdAt': datetime.now(timezone.utc),
        'updatedAt': datetime.now(timezone.utc),
        'idLairen': carta['idCarta'],
    }
    
    stmt = insert(cartas_table).values(**nueva_carta)
    stmt = stmt.on_conflict_do_update(
        index_elements=['idLairen'],
        set_={
            'nombre': stmt.excluded.nombre,
            'tipo': stmt.excluded.tipo,
            'subtipo1': stmt.excluded.subtipo1,
            'subtipo2': stmt.excluded.subtipo2,
            'subtipo3': stmt.excluded.subtipo3,
            'subtipo4': stmt.excluded.subtipo4,
            'supertipo': stmt.excluded.supertipo,
            'rareza': stmt.excluded.rareza,
            'coste': stmt.excluded.coste,
            'expansion': stmt.excluded.expansion,
            'imagen': stmt.excluded.imagen,
            'text': stmt.excluded.text,
            'costeBoveda': stmt.excluded.costeBoveda,
            'prohibida': stmt.excluded.prohibida,
            'updatedAt': datetime.now(timezone.utc),
        }
    )
    session.execute(stmt)

session.commit()

print("Cartas importadas exitosamente.")
