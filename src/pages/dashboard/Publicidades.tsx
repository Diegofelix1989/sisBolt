import React, { useState, useEffect } from 'react';
import { Image, Plus, Edit, Trash2, Search, X, Play, Pause, Eye } from 'lucide-react';
import { Publicidade, Tela, TipoMidia, StatusAtivo } from '../../types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { formatarDataHora } from '../../utils/formatadores';

interface FormPublicidade {
  titulo: string;
  tipo_midia: TipoMidia;
  media_path: string;
  duracao: number;
  tela_id: number;
  data_inicio?: string;
  data_fim?: string;
}

function Publicidades() {
  const [publicidades, setPublicidades] = useState<Publicidade[]>([]);
  const [telas, setTelas] = useState<Tela[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [publicidadeEditando, setPublicidadeEditando] = useState<Publicidade | null>(null);
  const [busca, setBusca] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormPublicidade>();
  
  // Carregar dados
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Simular chamada API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Carregar telas
        const telasMock: Tela[] = [
          {
            id: 1,
            nome: 'Painel Principal',
            local_id: 1,
            tipo_exibicao: 'ambos',
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          },
          {
            id: 2,
            nome: 'Painel Secundário',
            local_id: 1,
            tipo_exibicao: 'ambos',
            status: StatusAtivo.ATIVO,
            criado_em: new Date().toISOString()
          }
        ];
        
        // Carregar publicidades
        const publicidadesMock: Publicidade[] = [
          {
            id: 1,
            titulo: 'Promoção do Mês',
            tipo_midia: TipoMidia.IMAGEM,
            media_path: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
            duracao: 10,
            tela_id: 1,
            tela: telasMock[0],
            status: StatusAtivo.ATIVO,
            data_criacao: new Date().toISOString(),
            data_inicio: new Date().toISOString(),
            data_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            titulo: 'Vídeo Institucional',
            tipo_midia: TipoMidia.VIDEO,
            media_path: 'https://example.com/video.mp4',
            duracao: 30,
            tela_id: 1,
            tela: telasMock[0],
            status: StatusAtivo.ATIVO,
            data_criacao: new Date().toISOString()
          }
        ];
        
        setTelas(telasMock);
        setPublicidades(publicidadesMock);
      } catch (error) {
        toast.error('Erro ao carregar dados');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, []);

  // Filtrar publicidades
  const publicidadesFiltradas = publicidades.filter(publicidade => 
    publicidade.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    publicidade.tela?.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Adicionar/Editar publicidade
  const onSubmit = async (data: FormPublicidade) => {
    try {
      // Validar URL da mídia
      try {
        new URL(data.media_path);
      } catch {
        toast.error('URL da mídia inválida');
        return;
      }

      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (publicidadeEditando) {
        // Atualizar publicidade existente
        const publicidadeAtualizada: Publicidade = {
          ...publicidadeEditando,
          ...data,
          tela: telas.find(t => t.id === data.tela_id)
        };

        setPublicidades(publicidades => 
          publicidades.map(p => p.id === publicidadeEditando.id ? publicidadeAtualizada : p)
        );
        
        toast.success('Publicidade atualizada com sucesso!');
      } else {
        // Criar nova publicidade
        const novaPublicidade: Publicidade = {
          id: publicidades.length + 1,
          ...data,
          tela: telas.find(t => t.id === data.tela_id),
          status: StatusAtivo.ATIVO,
          data_criacao: new Date().toISOString()
        };

        setPublicidades([...publicidades, novaPublicidade]);
        toast.success('Publicidade criada com sucesso!');
      }

      setModalAberto(false);
      reset();
    } catch (error) {
      toast.error('Erro ao salvar publicidade');
      console.error(error);
    }
  };

  // Excluir publicidade
  const excluirPublicidade = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta publicidade?')) return;

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPublicidades(publicidades => publicidades.filter(p => p.id !== id));
      toast.success('Publicidade excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir publicidade');
      console.error(error);
    }
  };

  // Alternar status da publicidade
  const alternarStatus = async (publicidade: Publicidade) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novoStatus = publicidade.status === StatusAtivo.ATIVO 
        ? StatusAtivo.INATIVO 
        : StatusAtivo.ATIVO;
      
      setPublicidades(publicidades => 
        publicidades.map(p => 
          p.id === publicidade.id 
            ? { ...p, status: novoStatus }
            : p
        )
      );
      
      toast.success(`Publicidade ${novoStatus === StatusAtivo.ATIVO ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status da publicidade');
      console.error(error);
    }
  };

  // Visualizar mídia
  const visualizarMidia = (publicidade: Publicidade) => {
    window.open(publicidade.media_path, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Publicidades</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie o conteúdo publicitário exibido nas telas
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setPublicidadeEditando(null);
            setModalAberto(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Publicidade
        </button>
      </div>

      {/* Barra de busca */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex-1 max-w-lg relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar publicidades..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Lista de publicidades */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {carregando ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Carregando publicidades...</p>
          </div>
        ) : publicidadesFiltradas.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {publicidadesFiltradas.map((publicidade) => (
              <li key={publicidade.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {publicidade.tipo_midia === TipoMidia.VIDEO ? (
                          <Play className="h-8 w-8 text-gray-400" />
                        ) : (
                          <Image className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{publicidade.titulo}</p>
                        <p className="text-sm text-gray-500">
                          {publicidade.tela?.nome} • {publicidade.duracao}s
                        </p>
                        {publicidade.data_inicio && publicidade.data_fim && (
                          <p className="text-xs text-gray-500">
                            {formatarDataHora(publicidade.data_inicio)} até {formatarDataHora(publicidade.data_fim)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        publicidade.status === StatusAtivo.ATIVO 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {publicidade.status === StatusAtivo.ATIVO ? 'Ativa' : 'Inativa'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => visualizarMidia(publicidade)}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => alternarStatus(publicidade)}
                          className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${
                            publicidade.status === StatusAtivo.ATIVO 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          {publicidade.status === StatusAtivo.ATIVO ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setPublicidadeEditando(publicidade);
                            setModalAberto(true);
                          }}
                          className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => excluirPublicidade(publicidade.id)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma publicidade encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {busca ? 'Tente uma busca diferente.' : 'Comece adicionando uma nova publicidade.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de adicionar/editar publicidade */}
      {modalAberto && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Image className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {publicidadeEditando ? 'Editar Publicidade' : 'Nova Publicidade'}
                  </h3>
                  <div className="mt-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                          Título
                        </label>
                        <input
                          type="text"
                          {...register('titulo', { required: 'Título é obrigatório' })}
                          defaultValue={publicidadeEditando?.titulo}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.titulo && (
                          <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="tipo_midia" className="block text-sm font-medium text-gray-700">
                          Tipo de Mídia
                        </label>
                        <select
                          {...register('tipo_midia', { required: 'Tipo de mídia é obrigatório' })}
                          defaultValue={publicidadeEditando?.tipo_midia || TipoMidia.IMAGEM}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value={TipoMidia.IMAGEM}>Imagem</option>
                          <option value={TipoMidia.VIDEO}>Vídeo</option>
                          <option value={TipoMidia.TEXTO}>Texto</option>
                          <option value={TipoMidia.URL}>URL</option>
                        </select>
                        {errors.tipo_midia && (
                          <p className="mt-1 text-sm text-red-600">{errors.tipo_midia.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="media_path" className="block text-sm font-medium text-gray-700">
                          URL da Mídia
                        </label>
                        <input
                          type="text"
                          {...register('media_path', { required: 'URL da mídia é obrigatória' })}
                          defaultValue={publicidadeEditando?.media_path}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.media_path && (
                          <p className="mt-1 text-sm text-red-600">{errors.media_path.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="duracao" className="block text-sm font-medium text-gray-700">
                          Duração (segundos)
                        </label>
                        <input
                          type="number"
                          {...register('duracao', { 
                            required: 'Duração é obrigatória',
                            min: {
                              value: 1,
                              message: 'Duração deve ser maior que 0'
                            }
                          })}
                          defaultValue={publicidadeEditando?.duracao || 10}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.duracao && (
                          <p className="mt-1 text-sm text-red-600">{errors.duracao.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="tela_id" className="block text-sm font-medium text-gray-700">
                          Tela
                        </label>
                        <select
                          {...register('tela_id', { required: 'Tela é obrigatória' })}
                          defaultValue={publicidadeEditando?.tela_id}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">Selecione uma tela</option>
                          {telas.map(tela => (
                            <option key={tela.id} value={tela.id}>
                              {tela.nome}
                            </option>
                          ))}
                        </select>
                        {errors.tela_id && (
                          <p className="mt-1 text-sm text-red-600">{errors.tela_id.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700">
                            Data de Início
                          </label>
                          <input
                            type="datetime-local"
                            {...register('data_inicio')}
                            defaultValue={publicidadeEditando?.data_inicio?.split('.')[0]}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="data_fim" className="block text-sm font-medium text-gray-700">
                            Data de Fim
                          </label>
                          <input
                            type="datetime-local"
                            {...register('data_fim')}
                            defaultValue={publicidadeEditando?.data_fim?.split('.')[0]}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {publicidadeEditando ? 'Salvar' : 'Criar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setModalAberto(false);
                            reset();
                          }}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Publicidades;