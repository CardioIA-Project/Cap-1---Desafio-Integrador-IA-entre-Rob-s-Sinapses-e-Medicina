import re
from collections import Counter, defaultdict

# carrega a frase
def carregar_frase(caminho='frase.txt'):
    with open(caminho, 'r', encoding='utf-8') as f:
        return [linha.strip() for linha in f if linha.strip()] 

# dicionario de esxpressões de sintomas

sintomas_expressions =  {
    'dor_toracica': ['dor no peito', 'dor torácica', 'aperto no peito', 'peso no peito', 'queimação no peito'],
    'irradiação_braço': ['irradiação para o braço', 'dor no braço esquerdo', 'dor no braço direito'],
    'irradiação_mandibula': ['irradiação para a mandíbula', 'dor na mandíbula'],
    'sudorese': ['sudorese', 'suor frio', 'suando muito'],
    'náusea_vômito': ['náusea', 'enjoo', 'vômito', 'vomitando'],
    'dispneia': ['falta de ar', 'dispneia', 'respiração curta', 'dificuldade para respirar'],
    'palpitações': ['palpitação', 'palpitações', 'batimento acelerado', 'taquicardia'],
    'síncope': ['desmaio', 'síncope', 'perda de consciência'],
    'edema_membros': ['inchaço nas pernas', 'edema', 'edema de membros inferiores', 'inchaço nos tornozelos'],
    'hipertensão_aguda': ['pressão alta', 'hipertensão', 'pressão 200', 'pressão 180'],
    'dor_costas_aguda': ['dor nas costas intensa', 'dor dorsal súbita'],
    'dor_abdome': ['dor abdominal intensa', 'dor no abdome'],
    'febre': ['febre', 'temperatura alta'],
    'tosse_hemoptise': ['tosse com sangue', 'hemoptise', 'sangue ao tossir'],
    'dor_pleurítica': ['dor que piora ao respirar', 'dor pleurítica', 'dor ao respirar']

}

# mapa de conhecimento: diagnóstico -> sintomas chave

knowledge_base = {
    'Infarto Agudo do Miocárdio': ['dor_toracica','irradiação_braço','irradiação_mandibula','sudorese','náusea_vômito','dispneia'],
    'Angina Instável': ['dor_toracica','dispneia','sudorese'],
    'Insuficiência Cardíaca Aguda': ['dispneia','edema_membros','cansaço'],
    'Taquiarritmia': ['palpitações','dispneia','síncope'],
    'Bradiarritmia / Bloqueio': ['síncope','tontura','palpitações'],
    'Embolia Pulmonar': ['dispneia','dor_pleurítica','tosse_hemoptise','sudorese'],
    'Dissecção Aórtica': ['dor_toracica','dor_costas_aguda','dor_abdome','hipertensão_aguda'],
    'Miocardite': ['febre','dor_toracica','palpitações','dispneia'],
    'Reação hipertensiva grave / Crise hipertensiva': ['hipertensão_aguda','cefaleia','náusea_vômito','síncope']

}

# obs: 'cansaço' e 'tontura' podem ser extraídos como sintomas adicionais

sintomas_expressions.setdefault('cansaço', ['cansaço', 'fadiga', 'fraqueza'])
sintomas_expressions.setdefault('tontura', ['tontura', 'vertigem', 'sensação de desmaio'])
sintomas_expressions.setdefault('cefaleia', ['dor de cabeça', 'cefaleia', 'enxaqueca'])

# função para extrair sintomas

def extrair_sintomas(texto):
    texto_lower = texto.lower()
    sintomas_encontrados = []
    for sintoma, expressoes in sintomas_expressions.items():
        for exp in expressoes:
            if exp in texto_lower:
                sintomas_encontrados.append(sintoma)
                break
    return sintomas_encontrados

# função para calcular similaridade entre sintomas relatados e sintomas do diagnóstico

def calcular_similaridade(sintomas_relatados, diagnostico):
    sintomas_diagnostico = knowledge_base.get(diagnostico, [])
    if not sintomas_diagnostico:
        return 0
    acertos = sum(1 for sintoma in sintomas_relatados if sintoma in sintomas_diagnostico)
    return acertos / len(sintomas_diagnostico)

# função principal de diagnóstico

def diagnosticar(texto):
    sintomas_relatados = extrair_sintomas(texto)
    if not sintomas_relatados:
        return "Não consegui identificar sintomas. Por favor, descreva melhor."
    
    scores = {}
    for diagnostico in knowledge_base:
        scores[diagnostico] = calcular_similaridade(sintomas_relatados, diagnostico)
    
    diagnostico_principal = max(scores, key=scores.get)
    score_principal = scores[diagnostico_principal]
    
    if score_principal < 0.3:
        return "Os sintomas não correspondem claramente a nenhum diagnóstico. Recomendo procurar atendimento médico."
    
    return f"Com base nos sintomas, o diagnóstico mais provável é: {diagnostico_principal} (similaridade: {score_principal:.2f})"

# função para carregar frase

def carregar_frase(caminho='frases.txt'):
    with open(caminho, 'r', encoding='utf-8') as f:
        return [linha.strip() for linha in f if linha.strip()] 

# função para processar todas as frases

def processar_frases(frases):
    resultados = []
    for frase in frases:
        diagnostico = diagnosticar(frase)
        resultados.append((frase, diagnostico))
    return resultados

# função para salvar resultados

def salvar_resultados(resultados, caminho='resultados.txt'):
    with open(caminho, 'w', encoding='utf-8') as f:
        for frase, diagnostico in resultados:
            f.write(f"Frase: {frase}\n")
            f.write(f"Diagnóstico: {diagnostico}\n\n")

# função principal

def main():
    frases = carregar_frase()
    resultados = processar_frases(frases)
    salvar_resultados(resultados)
    print("Processamento concluído. Resultados salvos em resultados.txt")

if __name__ == "__main__":
    main()